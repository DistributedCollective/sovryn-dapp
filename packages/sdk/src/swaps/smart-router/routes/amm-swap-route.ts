import {
  BigNumber,
  BigNumberish,
  Contract,
  constants,
  providers,
} from 'ethers';

import {
  getAssetContract,
  getAssetDataByAddress,
  getProtocolContract,
} from '@sovryn/contracts';
import { ChainId, ChainIds, numberToChainId } from '@sovryn/ethers-provider';

import { RSK_STABLECOINS } from '../../../constants';
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
  let wrbtcMinter: Contract;

  const decimalsCache: Record<string, number> = {};

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

  const getWrbtcMinter = async () => {
    if (!wrbtcMinter) {
      const chainId = await getChainId();
      const { address, abi } = await getProtocolContract(
        'wrbtcMinter',
        chainId,
      );
      wrbtcMinter = new Contract(address, abi, provider);
    }
    return wrbtcMinter;
  };

  const isNativeToken = async (token: string) =>
    token === constants.AddressZero;

  const isNativeWrapper = async (token: string) =>
    token ===
    (await getAssetContract('WBTC', await getChainId())).address.toLowerCase();

  const getTokenAddress = async (token: string) => {
    if (await isNativeToken(token)) {
      if (wrbtcAddress) {
        return wrbtcAddress;
      }
      const chainId = await getChainId();
      wrbtcAddress = (await getAssetContract('WBTC', chainId)).address;
      return wrbtcAddress;
    }

    return token;
  };

  // The smart router works with 18-decimal-normalized amounts, while the AMM
  // converters operate in each token's native units. Every RSK AMM token used
  // to be 18 decimals, but USDT0 (6 decimals) breaks that assumption, so we
  // convert amounts in/out of native units around every on-chain call. These
  // helpers are a no-op for 18-decimal tokens.
  const getTokenDecimals = async (token: string): Promise<number> => {
    if (await isNativeToken(token)) {
      return 18;
    }
    const address = token.toLowerCase();
    if (decimalsCache[address] === undefined) {
      const chainId = await getChainId();
      // Tokens missing from the asset registry keep the legacy 18-decimals
      // pass-through so unsupported pairs still fail at the contract level.
      decimalsCache[address] = await getAssetDataByAddress(token, chainId)
        .then(item => item.decimals)
        .catch(() => 18);
    }
    return decimalsCache[address];
  };

  // 18-decimal-normalized -> token native units
  const denormalizeAmount = async (token: string, amount: BigNumberish) => {
    const decimals = await getTokenDecimals(token);
    const value = BigNumber.from(amount);
    if (decimals === 18) {
      return value;
    }
    return value.div(BigNumber.from(10).pow(18 - decimals));
  };

  // token native units -> 18-decimal-normalized
  const normalizeAmount = async (token: string, amount: BigNumberish) => {
    const decimals = await getTokenDecimals(token);
    const value = BigNumber.from(amount);
    if (decimals === 18) {
      return value;
    }
    return value.mul(BigNumber.from(10).pow(18 - decimals));
  };

  return {
    name: 'AMM',
    chains: [ChainIds.RSK_MAINNET, ChainIds.RSK_TESTNET],
    pairs: async () => {
      if (!pairCache) {
        const chainId = await getChainId();

        const swapTokens = [
          'BTC',
          'WBTC',
          'DLLR',
          'FISH',
          'MOC',
          'RIF',
          'SOV',
          'BNB',
          'DOC',
          'RUSDT',
          'ETH',
          'XUSD',
          'MYNT',
          'BPRO',
          'POWA',
          'BOS',
          'USDT0',
        ];

        const contracts = (
          await Promise.all(
            swapTokens.map(token => getAssetContract(token, chainId)),
          )
        ).map((contract, index) => ({
          address: contract.address.toLowerCase(),
          token: swapTokens[index],
        }));

        const pairs = new Map<string, string[]>();

        for (const contract of contracts) {
          const isStablecoin = RSK_STABLECOINS.find(
            token => token === contract.token,
          );

          const pair = contracts
            .filter(a => {
              return (
                a.address !== contract.address &&
                (!isStablecoin ||
                  !RSK_STABLECOINS.find(token => token === a.token))
              );
            })
            .map(contract => contract.address);
          pairs.set(contract.address, pair);
        }

        pairCache = pairs;
      }

      return pairCache;
    },
    quote: async (entry, destination, amount) => {
      if (
        ((await isNativeToken(entry)) &&
          (await isNativeWrapper(destination))) ||
        ((await isNativeToken(destination)) && (await isNativeWrapper(entry)))
      ) {
        return BigNumber.from(amount);
      }

      const baseToken = await getTokenAddress(entry);
      const quoteToken = await getTokenAddress(destination);

      // Quote in native units, return normalized to 18 decimals.
      const entryAmount = await denormalizeAmount(entry, amount);

      const expectedReturn = await (await getSwapQuoteContract())
        .getSwapExpectedReturn(baseToken, quoteToken, entryAmount)
        .catch(e => {
          throw makeError(e.message, SovrynErrorCode.ETHERS_CALL_EXCEPTION);
        });

      return normalizeAmount(destination, expectedReturn);
    },
    approve: async (entry, destination, amount, from, overrides) => {
      // native token is always approved
      if (await isNativeToken(entry)) {
        return undefined;
      }

      // swapping from WRBTC to RBTC is always approved
      if (
        (await isNativeWrapper(entry)) &&
        (await isNativeToken(destination))
      ) {
        return undefined;
      }

      const converter = await getConverterContract(entry, destination);

      // The incoming amount is 18-decimal-normalized; approve in native units.
      const approveAmount =
        amount === undefined || amount === null
          ? constants.MaxUint256
          : await denormalizeAmount(entry, amount);

      if (
        await hasEnoughAllowance(
          provider,
          entry,
          from,
          converter.address,
          approveAmount,
        )
      ) {
        return undefined;
      }

      return {
        ...makeApproveRequest(entry, converter.address, approveAmount),
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

      // RBTC -> WRBTC
      if (
        (await isNativeToken(entry)) &&
        (await isNativeWrapper(destination))
      ) {
        const minter = await getWrbtcMinter();
        return {
          to: minter.address,
          data: minter.interface.encodeFunctionData('deposit'),
          value: amount.toString(),
          gasLimit: 30_000,
          ...overrides,
        };
      }

      // WRBTC -> RBTC
      if (
        (await isNativeWrapper(entry)) &&
        (await isNativeToken(destination))
      ) {
        const minter = await getWrbtcMinter();
        return {
          to: minter.address,
          data: minter.interface.encodeFunctionData('withdraw', [amount]),
          // gasLimit: 30_000,
          ...overrides,
        };
      }

      const baseToken = await getTokenAddress(entry);
      const quoteToken = await getTokenAddress(destination);

      const entryIsNative = await isNativeToken(entry);
      const destinationIsNative = await isNativeToken(destination);

      const path = await (
        await getSwapNetworkContract()
      ).conversionPath(baseToken, quoteToken);

      const converter = await getConverterContract(entry, destination);

      // `quote()` returns an 18-decimal-normalized amount; convert both the
      // input amount and the min return into the tokens' native units for the
      // on-chain call.
      const entryAmount = await denormalizeAmount(entry, amount);

      const expectedReturn = await this.quote(
        entry,
        destination,
        amount,
        options,
      );

      const minReturn = await denormalizeAmount(
        destination,
        getMinReturn(expectedReturn, options?.slippage),
      );

      let args = [path, entryAmount, minReturn];

      if (!entryIsNative && !destinationIsNative) {
        args = [
          path,
          entryAmount,
          minReturn,
          constants.AddressZero,
          constants.AddressZero,
          '0',
        ];
      }

      return {
        to: converter.address,
        data: converter.interface.encodeFunctionData('convertByPath', args),
        value: entryIsNative ? entryAmount.toString() : '0',
        ...overrides,
      };
    },
  };
};
