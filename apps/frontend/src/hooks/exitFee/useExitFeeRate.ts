import { useMemo } from 'react';

import { Contract, constants } from 'ethers';

import { getProvider } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../../config/chains';

import { asyncCall } from '../../store/rxjs/provider-cache';
import { EXIT_FEE_REFERENCE_GROSS, EXIT_FEE_TTL } from '../../utils/exitFee';
import { useAccount } from '../useAccount';
import { useCacheCall } from '../useCacheCall';
import { useGetProtocolContract } from '../useGetContract';

export type ExitFeeRate = {
  active: boolean;
  rateBps: number;
  loading: boolean;
};

const INACTIVE = { active: false, rateBps: 0 };

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
        return INACTIVE;
      }
      try {
        const getter = new Contract(
          protocol.address,
          CONTROLLER_GETTER_ABI,
          getProvider(RSK_CHAIN_ID),
        );
        // negative-cached too: while undeployed this reverts and we cache INACTIVE
        const controllerAddress: string = await asyncCall(
          `exitFee/controllerAddress/${RSK_CHAIN_ID}/${protocol.address}`,
          () => getter.exitFeeController(),
          { ttl: EXIT_FEE_TTL },
        );
        if (!controllerAddress || controllerAddress === constants.AddressZero) {
          return INACTIVE;
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
        return { active: quote.active, rateBps: Number(quote.rateBps) };
      } catch (error) {
        return INACTIVE;
      }
    },
    [protocol?.address, surfaceId, subProduct, account],
    INACTIVE,
    { ttl: EXIT_FEE_TTL },
  );

  return useMemo(
    () => ({ active: value.active, rateBps: value.rateBps, loading }),
    [value, loading],
  );
};
