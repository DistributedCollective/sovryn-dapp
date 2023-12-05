import { Registry, SwapERC20 } from '@airswap/libraries';

import { BigNumber, constants, providers } from 'ethers';

import { SupportedTokens, getTokenContract } from '@sovryn/contracts';
import { ChainId, numberToChainId } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import {
  canSwapPair,
  makeApproveRequest,
  hasEnoughAllowance,
} from '../../../internal/utils';
import { SwapPairs, SwapRouteFunction } from '../types';

export const airSwapRoute: SwapRouteFunction = (
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

  const getOrder = async (entry, destination, amount, from) => {
    const baseToken = await validatedTokenAddress(entry);
    const quoteToken = await validatedTokenAddress(destination);
    const chainId = await getChainId();

    const servers = await Registry.getServers(
      provider,
      Number(chainId),
      baseToken,
      quoteToken,
    );

    const order = servers[0].getSignerSideOrderERC20(
      amount.toString(),
      baseToken,
      quoteToken,
      from,
    );

    return order;
  };

  const validatedTokenAddress = async (token: string) => {
    token = token.toLowerCase();

    return token;
  };

  return {
    name: 'AIR',
    pairs: async () => {
      if (!pairCache) {
        const chainId = await getChainId();

        const swapTokens = [SupportedTokens.rusdt, SupportedTokens.dllr];

        const contracts = await Promise.all(
          swapTokens.map(token => getTokenContract(token, chainId)),
        );

        const addresses = contracts.map(contract =>
          contract.address.toLowerCase(),
        );

        const pairs = new Map<string, string[]>();

        for (const address of addresses) {
          const pair = addresses.filter(a => a !== address);
          pairs.set(address, pair);
        }

        pairCache = pairs;
      }

      return pairCache;
    },
    quote: async (entry, destination, amount) => {
      const order = await getOrder(
        entry,
        destination,
        amount,
        constants.AddressZero,
      );
      return BigNumber.from((await order).signerAmount);
    },
    approve: async (entry, destination, amount, from, overrides) => {
      const chainId = await getChainId();
      const contractAddress = SwapERC20.getAddress(Number(chainId));

      if (
        !contractAddress ||
        (await hasEnoughAllowance(
          provider,
          entry,
          contractAddress,
          from,
          amount ?? constants.MaxUint256,
        ))
      ) {
        return undefined;
      }

      return {
        ...makeApproveRequest(
          entry,
          contractAddress,
          amount ?? constants.MaxUint256,
        ),
        ...overrides,
      };
    },
    permit: async () => Promise.resolve(undefined),
    async swap(entry, destination, amount, from, options, overrides) {
      const pairs = await this.pairs();
      if (!canSwapPair(entry, destination, pairs)) {
        throw makeError(
          `Cannot swap ${entry} to ${destination}`,
          SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
        );
      }

      const order = await getOrder(
        entry,
        destination,
        amount,
        constants.AddressZero,
      );
      const swapContract = SwapERC20.getContract(provider, Number(chainId));

      const tx = await swapContract.swapLight(order);

      return {
        to: tx.to,
        data: tx.data,
        value: amount.toString(),
        ...overrides,
      };
    },
  };
};
