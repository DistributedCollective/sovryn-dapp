import type { providers } from 'ethers';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import { SwapRouteFunction } from '../types';

export const zeroSwapRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  return {
    name: 'Zero',
    pairs: async () => {
      return new Map<string, string[]>();
    },
    quote: async () => {
      throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
    },
    swap(entry, destination, amount, slippage, overrides) {
      throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
    },
  };
};
