import { BigNumber, providers } from 'ethers';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import { SwapPairs, SwapRouteFunction } from '../types';
import { ChainId, numberToChainId } from '@sovryn/ethers-provider';
import { SupportedTokens, getTokenContract } from '@sovryn/contracts';

export const myntBassetRoute: SwapRouteFunction = (
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
    name: 'MyntBasset',
    async pairs() {
      if (pairCache) {
        return pairCache;
      }

      const chainId = await getChainId();
      const dllr = (await getTokenContract(SupportedTokens.dllr, chainId))
        .address;
      const zusd = (await getTokenContract(SupportedTokens.zusd, chainId))
        .address;
      const doc = (await getTokenContract(SupportedTokens.doc, chainId))
        .address;

      pairCache = new Map<string, string[]>([
        [dllr, [zusd, doc]],
        [zusd, [dllr]],
        [doc, [dllr]],
      ]);

      return pairCache;
    },
    async quote(entry, destination, amount, options?, overrides?) {
      // Mynt bAsset only converts stablecoins 1:1, so we can just return the amount if pairs are supported.
      const pairs = await this.pairs();
      if (pairs.has(entry)) {
        const quoteTokens = pairs.get(entry);
        if (quoteTokens?.includes(destination)) {
          return BigNumber.from(amount);
        }
      }
      return BigNumber.from(0);
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
