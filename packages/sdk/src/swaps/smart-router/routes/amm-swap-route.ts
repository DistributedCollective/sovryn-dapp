import { BigNumberish, Contract, providers } from 'ethers';

import {
  SupportedTokenList,
  getProtocolContract,
  getTokenContract,
} from '@sovryn/contracts';
import { ChainId, numberToChainId } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import { SwapPairs, SwapRouteFunction } from '../types';

export const ammSwapRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  let pairCache: SwapPairs;
  let chainId: ChainId;
  let contract: Contract;

  const getChainId = async () => {
    if (!chainId) {
      chainId = numberToChainId((await provider.getNetwork()).chainId);
    }
    return chainId;
  };

  const getContract = async () => {
    if (!contract) {
      const chainId = await getChainId();
      const { address, abi } = await getProtocolContract('protocol', chainId);
      contract = new Contract(address, abi, provider);
    }
    return contract;
  };

  return {
    name: 'AMM',
    pairs: async () => {
      if (pairCache) {
        return pairCache;
      }

      const chainId = await getChainId();

      const contracts = await Promise.all(
        SupportedTokenList.map(token =>
          getTokenContract(token.symbol, chainId),
        ),
      );

      const addresses = contracts.map(contract => contract.address);

      const pairs = new Map<string, string[]>();

      for (const address of addresses) {
        const pair = addresses.filter(a => a !== address);
        pairs.set(address, pair);
      }

      return pairs;
    },
    quote: async (
      base: string,
      quote: string,
      amount: BigNumberish,
      slippage?: BigNumberish,
      overrides?: Partial<providers.TransactionRequest>,
    ) => {
      return (await getContract())
        .getSwapExpectedReturn(base, quote, amount)
        .catch(e => {
          throw makeError(e.message, SovrynErrorCode.ETHERS_CALL_EXCEPTION);
        });
    },
    swap: () => {
      throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
    },
  };
};
