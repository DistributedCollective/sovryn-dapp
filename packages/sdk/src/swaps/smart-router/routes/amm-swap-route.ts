import { BigNumber, Contract, constants, providers } from 'ethers';

import { getAssetContract, getProtocolContract } from '@sovryn/contracts';
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

      // swapping from WRBTC to RBTC is always approved
      if (
        (await isNativeWrapper(entry)) &&
        (await isNativeToken(destination))
      ) {
        return undefined;
      }

      const converter = await getConverterContract(entry, destination);

      if (
        await hasEnoughAllowance(
          provider,
          entry,
          from,
          converter.address,
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
