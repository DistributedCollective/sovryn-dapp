import { useMemo } from 'react';

import { Contract, constants } from 'ethers';

import { getProvider } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../../config/chains';

import { asyncCall } from '../../store/rxjs/provider-cache';
import { EXIT_DELAY_TTL } from '../../utils/exitDelay';
import { useAccount } from '../useAccount';
import { useCacheCall } from '../useCacheCall';
import { useGetProtocolContract } from '../useGetContract';

export type ExitDelayQuote = {
  /** Seconds the perimeter will hold this withdrawal. 0 means paid directly. */
  delaySeconds: number;
  loading: boolean;
};

const NO_DELAY = { delaySeconds: 0 };

const CONTROLLER_GETTER_ABI = [
  'function exitFeeController() view returns (address)',
];

const CONTROLLER_ABI = [
  'function quoteExitDelayFor(address rawOriginator, address owner, address receiver, bytes32 surfaceId, address subProduct) view returns (uint32 d, address effOrig, address effOwner)',
];

/**
 * How long the perimeter would hold a withdrawal this account makes now.
 *
 * Reads the controller through the protocol's own pointer, the same route the
 * consumer contracts take, so the quote cannot disagree with what the exit
 * will actually do. Fails to "no delay": while the perimeter is undeployed or
 * unwired this reverts, the result is cached as zero, and every form renders
 * exactly as it does without the perimeter.
 *
 * The three identity arguments are all this account: on the surfaces a user
 * reaches from the app the originator, the position owner and the payout
 * receiver are the same person. Passthrough surfaces resolve differently
 * on-chain, and quoting them from here would be a guess.
 */
export const useExitDelayQuote = (
  surfaceId: string,
  subProduct: string | undefined,
): ExitDelayQuote => {
  const { account } = useAccount();
  const protocol = useGetProtocolContract('protocol', RSK_CHAIN_ID);

  const { value, loading } = useCacheCall(
    `exitDelay/quote/${surfaceId}/${subProduct}/${account}`,
    RSK_CHAIN_ID,
    async () => {
      if (!protocol || !subProduct || !account) {
        return NO_DELAY;
      }
      try {
        const getter = new Contract(
          protocol.address,
          CONTROLLER_GETTER_ABI,
          getProvider(RSK_CHAIN_ID),
        );
        const controllerAddress: string = await asyncCall(
          `exitFee/controllerAddress/${RSK_CHAIN_ID}/${protocol.address}`,
          () => getter.exitFeeController(),
          { ttl: EXIT_DELAY_TTL },
        );
        if (!controllerAddress || controllerAddress === constants.AddressZero) {
          return NO_DELAY;
        }
        const controller = new Contract(
          controllerAddress,
          CONTROLLER_ABI,
          getProvider(RSK_CHAIN_ID),
        );
        const quote = await controller.quoteExitDelayFor(
          account,
          account,
          account,
          surfaceId,
          subProduct,
        );
        return { delaySeconds: Number(quote.d) };
      } catch (error) {
        return NO_DELAY;
      }
    },
    [protocol?.address, surfaceId, subProduct, account],
    NO_DELAY,
    { ttl: EXIT_DELAY_TTL },
  );

  return useMemo(
    () => ({ delaySeconds: value.delaySeconds, loading }),
    [value, loading],
  );
};
