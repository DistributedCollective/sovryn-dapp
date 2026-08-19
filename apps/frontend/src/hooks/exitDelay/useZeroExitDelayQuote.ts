import { useMemo } from 'react';

import { Contract, constants } from 'ethers';

import { getZeroContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import { asyncCall } from '../../store/rxjs/provider-cache';
import { getRskChainId } from '../../utils/chain';
import { EXIT_DELAY_TTL } from '../../utils/exitDelay';
import { SURFACE_ZERO_WITHDRAW_COLL } from '../../utils/exitFee';
import { useAccount } from '../useAccount';
import { useCacheCall } from '../useCacheCall';

export type ZeroExitDelayQuote = {
  /** Seconds the perimeter will hold this collateral withdrawal. */
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
 * How long the perimeter would hold collateral leaving a line of credit.
 *
 * Zero keeps its own controller pointer on BorrowerOperations rather than
 * reading the lending protocol's, so this resolves through Zero — the same
 * route the collateral exit itself takes. Fails to "no delay" while the
 * perimeter is undeployed, unwired or disabled.
 *
 * Zero has no passthrough on this surface: the borrower is the originator, the
 * position owner and the payout receiver, so all three identity arguments are
 * this account. `subProduct` is the zero address — there is a single Zero
 * deployment, not a family of sub-products.
 */
export const useZeroExitDelayQuote = (): ZeroExitDelayQuote => {
  const { account } = useAccount();

  const { value, loading } = useCacheCall(
    `exitDelay/zero/${account}`,
    getRskChainId(),
    async () => {
      if (!account) {
        return NO_DELAY;
      }
      try {
        const { address } = await getZeroContract(
          'borrowerOperations',
          getRskChainId(),
        );
        const getter = new Contract(
          address,
          CONTROLLER_GETTER_ABI,
          getProvider(getRskChainId()),
        );
        const controllerAddress: string = await asyncCall(
          `exitDelay/zeroControllerAddress/${getRskChainId()}/${address}`,
          () => getter.exitFeeController(),
          { ttl: EXIT_DELAY_TTL },
        );
        if (!controllerAddress || controllerAddress === constants.AddressZero) {
          return NO_DELAY;
        }
        const controller = new Contract(
          controllerAddress,
          CONTROLLER_ABI,
          getProvider(getRskChainId()),
        );
        const quote = await controller.quoteExitDelayFor(
          account,
          account,
          account,
          SURFACE_ZERO_WITHDRAW_COLL,
          constants.AddressZero,
        );
        return { delaySeconds: Number(quote.d) };
      } catch (error) {
        return NO_DELAY;
      }
    },
    [account],
    NO_DELAY,
    { ttl: EXIT_DELAY_TTL },
  );

  return useMemo(
    () => ({ delaySeconds: value.delaySeconds, loading }),
    [value, loading],
  );
};
