import { Contract, constants, providers } from 'ethers';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenContract,
  getTokenDetailsByAddress,
} from '@sovryn/contracts';
import { ChainId, numberToChainId } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import {
  canSwapPair,
  getMinReturn,
  makeApproveRequest,
  hasEnoughAllowance,
} from '../../../internal/utils';
import { SwapPairs, SwapRouteFunction } from '../types';

export const ammSwapRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  let pairCache: SwapPairs;
  let chainId: ChainId;
  let wrbtcAddress: string;

  let swapConverter: Contract;
  let rbtcConverter: Contract;
  let protocolContract: Contract;
  let fixedRateMyntContract: Contract;

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

  const getFixedRateMyntContract = async () => {
    const chainId = await getChainId();
    const { address, abi } = await getProtocolContract(
      'fixedRateMynt',
      chainId,
    );
    return new Contract(address, abi, provider);
  };

  const getConverterContract = async (entry: string, destination: string) => {
    const tokenSymbol = (await getTokenDetailsByAddress(entry)).symbol;

    if ((await isNativeToken(entry)) || (await isNativeToken(destination))) {
      if (!rbtcConverter) {
        const chainId = await getChainId();
        const { address, abi } = await getProtocolContract(
          'btcWrapperProxy',
          chainId,
        );
        rbtcConverter = new Contract(address, abi, provider);
      }
      return rbtcConverter;
    } else if (tokenSymbol === SupportedTokens.mynt) {
      if (!fixedRateMyntContract) {
        fixedRateMyntContract = await getFixedRateMyntContract();
      }
      return fixedRateMyntContract;
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

  const isNativeToken = async (token: string) =>
    token === constants.AddressZero ||
    token ===
      (
        await getTokenContract(SupportedTokens.wrbtc, await getChainId())
      ).address.toLowerCase();

  const validatedTokenAddress = async (token: string) => {
    token = token.toLowerCase();
    if (await isNativeToken(token)) {
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
      if (!pairCache) {
        const chainId = await getChainId();

        const swapTokens = [
          SupportedTokens.rbtc,
          SupportedTokens.dllr,
          SupportedTokens.fish,
          SupportedTokens.moc,
          SupportedTokens.rif,
          SupportedTokens.sov,
          SupportedTokens.mynt,
          // Temporarily disabled in https://sovryn.atlassian.net/browse/SOV-2595
          // SupportedTokens.eths,
          // SupportedTokens.bnbs,
        ];

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
      if (await isNativeToken(entry)) {
        return undefined;
      }

      const converter = await getConverterContract(entry, destination);

      if (
        await hasEnoughAllowance(
          provider,
          entry,
          converter.address,
          from,
          amount ?? constants.MaxUint256,
        )
      ) {
        return undefined;
      }

      return {
        ...makeApproveRequest(
          entry,
          converter.address,
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

      const baseToken = await validatedTokenAddress(entry);
      const quoteToken = await validatedTokenAddress(destination);

      const entryIsNative = await isNativeToken(entry);
      const destinationIsNative = await isNativeToken(destination);

      const path = await (
        await getSwapNetworkContract()
      ).conversionPath(baseToken, quoteToken);

      const converter = await getConverterContract(entry, destination);
      const tokenSymbol = (await getTokenDetailsByAddress(entry)).symbol;

      const expectedReturn = await this.quote(
        entry,
        destination,
        amount,
        options,
      );

      const minReturn = getMinReturn(expectedReturn, options?.slippage);

      let args = [path, amount, minReturn];

      if (
        !entryIsNative &&
        !destinationIsNative &&
        tokenSymbol !== SupportedTokens.mynt
      ) {
        args = [
          path,
          amount,
          minReturn,
          constants.AddressZero,
          constants.AddressZero,
          '0',
        ];
      }

      const data =
        tokenSymbol === SupportedTokens.mynt
          ? converter.interface.encodeFunctionData('convert', [amount])
          : converter.interface.encodeFunctionData('convertByPath', args);

      return {
        to: converter.address,
        data: data,
        value: entryIsNative ? amount.toString() : '0',
        ...overrides,
      };
    },
  };
};
