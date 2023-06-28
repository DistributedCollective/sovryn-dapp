import { Contract, constants, providers } from 'ethers';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenContract,
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

  const getTokenAddress = async (token: SupportedTokens) =>
    (await getTokenContract(token, await getChainId())).address.toLowerCase();

  return {
    name: 'AMM',
    pairs: async () => {
      if (!pairCache) {
        const bnbs = await getTokenAddress(SupportedTokens.bnbs);
        const rbtc = await getTokenAddress(SupportedTokens.rbtc);
        const dllr = await getTokenAddress(SupportedTokens.dllr);
        const eths = await getTokenAddress(SupportedTokens.eths);
        const fish = await getTokenAddress(SupportedTokens.fish);
        const moc = await getTokenAddress(SupportedTokens.moc);
        const rif = await getTokenAddress(SupportedTokens.rif);
        const sov = await getTokenAddress(SupportedTokens.sov);

        pairCache = new Map<string, string[]>([
          [rbtc, [bnbs, dllr, eths, fish, moc, rif, sov]],
          [bnbs, [rbtc]],
          [dllr, [rbtc]],
          [eths, [rbtc]],
          [fish, [rbtc]],
          [moc, [rbtc]],
          [rif, [rbtc]],
          [sov, [rbtc]],
        ]);
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

      const expectedReturn = await this.quote(
        entry,
        destination,
        amount,
        options,
      );

      const minReturn = getMinReturn(expectedReturn, options?.slippage);

      let args = [path, amount, minReturn];

      if (!entryIsNative && !destinationIsNative) {
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
        value: entryIsNative ? amount.toString() : '0',
        ...overrides,
      };
    },
  };
};
