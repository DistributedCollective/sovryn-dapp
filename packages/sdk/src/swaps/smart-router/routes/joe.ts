import {
  BigNumber,
  BigNumberish,
  Contract,
  constants,
  providers,
  utils,
} from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { createPublicClient, defineChain, http, parseUnits } from 'viem';

import { getAssetDataByAddress, getProtocolContract } from '@sovryn/contracts';
import {
  ChainId,
  ChainIds,
  chainIdToNumber,
  numberToChainId,
} from '@sovryn/ethers-provider';
import { Percent, Token, TokenAmount } from '@sovryn/joe-core';
import { PairV2, RouteV2, TradeOptions, TradeV2 } from '@sovryn/joe-sdk-v2';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import {
  makeApproveRequest,
  hasEnoughAllowance,
  areAddressesEqual,
  unique,
} from '../../../internal/utils';
import { SwapPairs, SwapRouteFunction } from '../types';

const bobTestnet = defineChain({
  id: 808813,
  name: 'Bob Testnet',
  nativeCurrency: {
    name: 'Bob Testnet',
    symbol: 'tETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://bob-sepolia.rpc.gobob.xyz'],
    },
  },
  blockExplorerUrls: ['https://testnet-explorer.gobob.xyz'],
  contracts: {
    multicall3: {
      address: '0x43aCeB7846d580877D2B98A6c3b0ea51a39a62A4',
    },
  },
});

const TESTNET_RPC = 'https://bob-sepolia.rpc.gobob.xyz';

export const joeRoute: SwapRouteFunction = (provider: providers.Provider) => {
  let pairCache: SwapPairs;

  let joeBases: Token[];

  let chainId: ChainId;

  let swapConverter: Contract;

  const getPublicClient = (chainId: ChainId) => {
    // todo: use the correct rpc url
    // todo: cache the client
    return createPublicClient({
      chain: bobTestnet,
      transport: http(TESTNET_RPC),
    });
  };

  const getChainId = async () => {
    if (!chainId) {
      chainId = numberToChainId((await provider.getNetwork()).chainId);
    }
    return chainId;
  };

  const getRouterContract = async () => {
    if (!swapConverter) {
      const chainId = await getChainId();
      const { address, abi } = await getProtocolContract('lbRouter', chainId);
      swapConverter = new Contract(address, abi, provider);
    }
    return swapConverter;
  };

  const getBases = async () => {
    if (!joeBases) {
      const chainId = await getChainId();
      joeBases = await loadTokens(chainId);
    }

    return joeBases;
  };

  const isNativeToken = async (token: string) =>
    token === constants.AddressZero;

  return {
    name: 'Trader Joe',
    chains: [ChainIds.BOB_TESTNET],
    pairs: async () => {
      if (!pairCache) {
        const bases = await getBases();

        const contracts = bases.map(contract => ({
          address: contract.address.toLowerCase(),
          token: contract.symbol,
        }));

        const pairs = new Map<string, string[]>();

        for (const contract of contracts) {
          const pair = contracts
            .filter(a => {
              return a.address !== contract.address;
            })
            .map(contract => contract.address);
          pairs.set(contract.address, pair);
        }

        pairCache = pairs;
      }

      return pairCache;
    },
    async getBestTrade(entry: string, destination: string, amount: BigNumber) {
      await this.pairs();
      const bases = await getBases();

      const inputToken = bases.find(token =>
        areAddressesEqual(token.address, entry),
      );
      const outputToken = bases.find(token =>
        areAddressesEqual(token.address, destination),
      );

      if (!inputToken || !outputToken) {
        throw makeError(
          `Token not found: ${entry} or ${destination}`,
          SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
        );
      }

      const isExactIn = true;

      const typedValue = formatUnits(amount, 18);
      const typedValueInParsed = parseUnits(typedValue, 18);

      const amountIn = new TokenAmount(inputToken, typedValueInParsed);

      const allTokenPairs = PairV2.createAllTokenPairs(
        inputToken,
        outputToken,
        bases,
      );

      const allPairs = PairV2.initPairs(allTokenPairs);
      const allRoutes = RouteV2.createAllRoutes(
        allPairs,
        inputToken,
        outputToken,
      );

      const isNativeIn = inputToken.isNative;
      const isNativeOut = outputToken.isNative;

      const trades = (await TradeV2.getTradesExactIn(
        allRoutes,
        amountIn,
        outputToken,
        isNativeIn,
        isNativeOut,
        getPublicClient(chainId),
        chainIdToNumber(chainId),
      )) as TradeV2[];

      return TradeV2.chooseBestTrade(trades, isExactIn);
    },
    async quote(entry, destination, amount) {
      amount = await parseAmount(await getChainId(), entry, amount);

      const bestTrade: TradeV2 = await (this as any).getBestTrade(
        entry,
        destination,
        amount,
      );

      if (!bestTrade) {
        return BigNumber.from('0');
      }

      // return BigNumber.from(bestTrade.outputAmount.raw.toString());
      return BigNumber.from(bestTrade.outputAmount.raw.toString()).mul(
        Math.pow(10, 18 - bestTrade.outputAmount.currency.decimals),
      );
    },
    approve: async (entry, destination, amount, from, overrides) => {
      // native token is always approved
      if (await isNativeToken(entry)) {
        return undefined;
      }

      amount = await parseAmount(await getChainId(), entry, amount);
      const converter = await getRouterContract();

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
      amount = await parseAmount(await getChainId(), entry, amount);

      const bestTrade: TradeV2 = await (this as any).getBestTrade(
        entry,
        destination,
        amount,
      );

      if (!bestTrade) {
        throw makeError(
          `Cannot swap ${entry} to ${destination}`,
          SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
        );
      }

      const allowedSlippage = new Percent(
        options?.slippage?.toString() ?? '50',
        '10000',
      );

      const swapOptions: TradeOptions = {
        allowedSlippage,
        ttl: 3600,
        recipient: from,
        feeOnTransfer: false, // or true?
      };

      const { methodName, args, value } =
        bestTrade.swapCallParameters(swapOptions);

      const router = await getRouterContract();

      return {
        to: router.address,
        data: router.interface.encodeFunctionData(methodName, args),
        value: value.toString(),
        gasLimit: 1_000_000,
      };
    },
  };
};

async function loadTokens(chain: ChainId) {
  const url = 'https://bob-joe-subgraph.sovryn.app/subgraphs/name/joe-v2';
  const query = `
    {
      lbpairs {
        id
        tokenX {
          id
          decimals
        }
        tokenY {
          id
          decimals
        }
      }
    }
  `;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();

  const addresses: string[] = unique(
    (data?.lbpairs || []).map(pair => [pair.tokenX.id, pair.tokenY.id]).flat(),
  );

  return await Promise.all(
    addresses.map(address => getAssetDataByAddress(address, chain)),
  ).then(items =>
    items
      .filter(item => !!item)
      .map(
        item =>
          new Token(
            chainIdToNumber(chain),
            item.address,
            item.decimals,
            item.symbol,
            item.name,
          ),
      ),
  );
}

const parseAmount = async (
  chain: ChainId,
  token: string,
  amount: BigNumberish,
): Promise<BigNumber> => {
  const data = await getAssetDataByAddress(token, chain);
  return utils.parseUnits(utils.formatEther(amount), data.decimals);
};
