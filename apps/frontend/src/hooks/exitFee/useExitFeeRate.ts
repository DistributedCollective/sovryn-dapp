import { useMemo } from 'react';

import { Contract, constants } from 'ethers';

import { getProvider } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../../config/chains';

import { asyncCall } from '../../store/rxjs/provider-cache';
import {
  EXIT_FEE_REFERENCE_GROSS,
  EXIT_FEE_TTL,
  ExitFeeQuote,
} from '../../utils/exitFee';
import { useAccount } from '../useAccount';
import { useCacheCall } from '../useCacheCall';
import { useGetProtocolContract } from '../useGetContract';

export type ExitFeeRate = ExitFeeQuote;

/** No quote obtained. Renders as "unavailable", never as "no fee". */
const UNKNOWN = { active: false, rateBps: 0, unknown: true };
/**
 * A real answer of "nothing is charged": the protocol holds no controller
 * pointer, so the on-chain path charges nothing by construction. This is a
 * fact, not a failure, and must not be shown as unavailable.
 */
const UNCHARGED = { active: false, rateBps: 0, unknown: false };

const CONTROLLER_GETTER_ABI = [
  'function exitFeeController() view returns (address)',
];

const CONTROLLER_ABI = [
  'function quoteExitFee(bytes32 surfaceId, address subProduct, address actor, uint256 grossAmount) view returns (tuple(bool active, uint16 rateBps, uint256 feeAmount, uint256 netAmount, address feeReceiver, uint8 reason))',
];

export const useExitFeeRate = (
  surfaceId: string,
  subProduct: string | undefined,
): ExitFeeRate => {
  const { account } = useAccount();
  const protocol = useGetProtocolContract('protocol', RSK_CHAIN_ID);

  const { value, loading } = useCacheCall(
    `exitFee/rate/${surfaceId}/${subProduct}/${account}`,
    RSK_CHAIN_ID,
    async () => {
      if (!protocol || !subProduct || !account) {
        // Nothing was asked, so nothing is known.
        return UNKNOWN;
      }
      try {
        const getter = new Contract(
          protocol.address,
          CONTROLLER_GETTER_ABI,
          getProvider(RSK_CHAIN_ID),
        );
        // negative-cached too: while undeployed this reverts and we cache UNKNOWN
        const controllerAddress: string = await asyncCall(
          `exitFee/controllerAddress/${RSK_CHAIN_ID}/${protocol.address}`,
          () => getter.exitFeeController(),
          { ttl: EXIT_FEE_TTL },
        );
        if (!controllerAddress || controllerAddress === constants.AddressZero) {
          return UNCHARGED;
        }
        const controller = new Contract(
          controllerAddress,
          CONTROLLER_ABI,
          getProvider(RSK_CHAIN_ID),
        );
        const [quote] = await controller.functions.quoteExitFee(
          surfaceId,
          subProduct,
          account,
          EXIT_FEE_REFERENCE_GROSS,
        );
        return {
          active: quote.active,
          rateBps: Number(quote.rateBps),
          unknown: false,
        };
      } catch (error) {
        // Reverts, RPC failures and decode errors land here alike. Every one of
        // them means we do not know the rate -- not that the rate is zero.
        return UNKNOWN;
      }
    },
    [protocol?.address, surfaceId, subProduct, account],
    UNKNOWN,
    { ttl: EXIT_FEE_TTL },
  );

  return useMemo(
    () => ({
      active: value.active,
      rateBps: value.rateBps,
      unknown: value.unknown,
      loading,
    }),
    [value, loading],
  );
};
