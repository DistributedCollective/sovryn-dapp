import type { providers } from 'ethers';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import { SwapPairs, SwapRouteFunction } from '../types';
import { ChainId, numberToChainId } from '@sovryn/ethers-provider';

// Supports converting DLLR to RBTC via getDocFromDllrAndRedeemRBTC function on the MoCIntegration contract.
export const mocIntegrationSwapRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  let pairCache: SwapPairs;
  let chainId: ChainId;

  const getChainId = async () => {
    if (!chainId) {
      chainId = numberToChainId((await provider.getNetwork()).chainId);
    }
    return chainId;
  };

  return {
    name: 'MocIntegration',
    async pairs() {
      throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
    },
    async quote(entry, destination, amount, options?, overrides?) {
      throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
    },
    async swap(entry, destination, amount, options, overrides) {
      throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
    },
    async approve(entry, destination, amount, overrides) {
      throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
    },
    async permit(entry, destination, amount, overrides) {
      throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
    },
  };
};
