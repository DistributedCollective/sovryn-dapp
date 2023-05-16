import { Contract, constants, providers } from 'ethers';

import {
  SupportedTokenList,
  SupportedTokens,
  getProtocolContract,
  getTokenContract,
} from '@sovryn/contracts';
import { ChainId, numberToChainId } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import { SwapPairs, SwapRouteFunction } from '../types';
import {
  canSwapPair,
  getMinReturn,
  makeApproveRequest,
} from '../../../internal/utils';

export const ammSwapRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  let pairCache: SwapPairs;
  let chainId: ChainId;
  let wrbtcAddress: string;

  let swapConverter: Contract;
  let rbtcConverter: Contract;
  let protocolContract: Contract;

  const getChainId = async () => {
    if (!chainId) {
      chainId = numberToChainId((await provider.getNetwork()).chainId);
    }
    return chainId;
  };

  const getSwapNetworkContract = async () => {
    if (!swapConverter) {
      const chainId = await getChainId();
      const { address, abi } = await getProtocolContract(
        'swapNetwork',
        chainId,
      );
      swapConverter = new Contract(address, abi, provider);
    }
    return swapConverter;
  };

  const getConverterContract = async (entry: string, destination: string) => {
    if (isNativeToken(entry) || isNativeToken(destination)) {
      if (!rbtcConverter) {
        const chainId = await getChainId();
        const { address, abi } = await getProtocolContract(
          'btcWrapperProxy',
          chainId,
        );
        rbtcConverter = new Contract(address, abi, provider);
      }
      return rbtcConverter;
    }

    return getSwapNetworkContract();
  };

  const getSwapQuoteContract = async () => {
    if (!protocolContract) {
      const chainId = await getChainId();
      const { address, abi } = await getProtocolContract('protocol', chainId);
      protocolContract = new Contract(address, abi, provider);
    }
    return protocolContract;
  };

  const isNativeToken = (token: string) => token === constants.AddressZero;

  const validatedTokenAddress = async (token: string) => {
    token = token.toLowerCase();
    if (isNativeToken(token)) {
      if (wrbtcAddress) {
        return wrbtcAddress;
      }
      const chainId = await getChainId();
      wrbtcAddress = (await getTokenContract(SupportedTokens.wrbtc, chainId))
        .address;
      return wrbtcAddress;
    }

    return token;
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

      const addresses = contracts.map(contract =>
        contract.address.toLowerCase(),
      );

      const pairs = new Map<string, string[]>();

      for (const address of addresses) {
        const pair = addresses.filter(a => a !== address);
        pairs.set(address, pair);
      }

      return pairs;
    },
    quote: async (entry, destination, amount, options?, overrides?) => {
      const baseToken = await validatedTokenAddress(entry);
      const quoteToken = await validatedTokenAddress(destination);
      return (await getSwapQuoteContract())
        .getSwapExpectedReturn(baseToken, quoteToken, amount)
        .catch(e => {
          throw makeError(e.message, SovrynErrorCode.ETHERS_CALL_EXCEPTION);
        });
    },
    approve: async (entry, destination, amount, from, overrides) => {
      // native token is always approved
      if (isNativeToken(entry)) {
        return Promise.resolve(undefined);
      }

      const converter = await getConverterContract(entry, destination);

      return {
        ...makeApproveRequest(
          entry,
          converter.address,
          amount ?? constants.MaxUint256,
        ),
        ...overrides,
      };
    },
    permit: async (entry, destination, amount, from, overrides) =>
      Promise.resolve(undefined),
    async swap(entry, destination, amount, from, options, overrides) {
      const pairs = await this.pairs();
      if (!canSwapPair(entry, destination, pairs)) {
        throw makeError(
          `Cannot swap ${entry} to ${destination}`,
          SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
        );
      }

      const baseToken = await validatedTokenAddress(entry);
      const quoteToken = await validatedTokenAddress(destination);

      const path = await (
        await getSwapNetworkContract()
      ).conversionPath(baseToken, quoteToken);

      const converter = await getConverterContract(entry, destination);

      const expectedReturn = await this.quote(
        entry,
        destination,
        amount,
        options,
      );

      const minReturn = getMinReturn(expectedReturn, options?.slippage);

      let args = [path, amount, minReturn];

      if (!isNativeToken(entry) && !isNativeToken(destination)) {
        args = [
          path,
          amount,
          minReturn,
          constants.AddressZero,
          constants.AddressZero,
          '0',
        ];
      }

      return {
        to: converter.address,
        data: converter.interface.encodeFunctionData('convertByPath', args),
        value: isNativeToken(entry) ? amount.toString() : '0',
        ...overrides,
      };
    },
  };
};
