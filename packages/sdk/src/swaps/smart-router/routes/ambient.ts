import { providers } from 'ethers';

import { ChainIds } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import { SwapRouteFunction } from '../types';

export const ambientRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  return {
    name: 'Ambient',
    chains: [ChainIds.SEPOLIA, ChainIds.RSK_TESTNET],
    pairs: async () => {
      return new Map<string, string[]>([
        ['0x0', ['0x1']],
        ['0x1', ['0x0']],
      ]);
    },
    quote: async (entry, destination, amount) => {
      throw makeError('unknown', SovrynErrorCode.ETHERS_CALL_EXCEPTION);
    },
    approve: async (entry, destination, amount, from, overrides) => {
      throw makeError('unknown', SovrynErrorCode.ETHERS_CALL_EXCEPTION);
    },
    permit: async () => Promise.resolve(undefined),
    async swap(entry, destination, amount, from, options, overrides) {
      throw makeError('unknown', SovrynErrorCode.ETHERS_CALL_EXCEPTION);
    },
  };
};
