import { BigNumber, utils, providers, constants, BigNumberish } from 'ethers';

import { getAssetContract } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';
import { numberToChainId } from '@sovryn/ethers-provider';
import { CrocEnv, CrocPoolView } from '@sovryn/sdex';
import { OrderDirective } from '@sovryn/sdex/dist/encoding/longform';
import { Decimal } from '@sovryn/utils';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import {
  hasEnoughAllowance,
  makeApproveRequest,
} from '../../../internal/utils';
import { SwapRouteFunction } from '../types';
import {
  Pool,
  bfsShortestPath,
  calcImpact,
  constructGraph,
  fetchPools,
  groupItemsInPairs,
} from '../utils/ambient-utils';

export const ambientRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  const getChainId = async () =>
    numberToChainId((await provider.getNetwork()).chainId);

  const makePlan = async (
    entry: string,
    destination: string,
    _amount: BigNumber,
    slippage?: number,
  ) => {
    const env = new CrocEnv(provider);

    const amount = await parseAmount(env, entry, _amount);

    return env
      .sell(entry, BigNumber.from(amount))
      .for(destination, { slippage });
  };

  const poolCache: Record<string, Pool[]> = {};
  const loadPools = async () => {
    const chainId = await getChainId();
    if (!poolCache[chainId]) {
      // testing for virtual network fork...
      if (chainId === ChainIds.FORK) {
        const eth = (await getAssetContract('ETH', chainId)).address;
        const sov = (await getAssetContract('SOV', chainId)).address;
        const usdt = (await getAssetContract('USDT', chainId)).address;
        const usdc = (await getAssetContract('USDC', chainId)).address;
        const dai = (await getAssetContract('DAI', chainId)).address;
        const vct = (await getAssetContract('VCT', chainId)).address;
        const pools: Pool[] = [
          [eth, sov],
          [eth, usdc],
          [eth, usdt],
          [eth, dai],
          [eth, vct],
        ];

        poolCache[chainId] = pools;

        return pools;
      }

      const pools = await fetchPools(chainId);
      poolCache[chainId] = pools;
    }

    return poolCache[chainId];
  };

  return {
    name: 'Ambient',
    // todo: remove fork chain before release
    chains: [
      ChainIds.BOB_MAINNET,
      ChainIds.BOB_TESTNET,
      ChainIds.FORK,
      ChainIds.SEPOLIA,
    ],
    pairs: async () => {
      const pools = await loadPools();

      const uniqueTokens = new Set<string>();
      pools.forEach(pool => pool.forEach(token => uniqueTokens.add(token)));
      const tokens = Array.from(uniqueTokens);

      const pairs = new Map<string, string[]>();

      // each token with each other token
      tokens.forEach(tokenA => {
        tokens.forEach(tokenB => {
          if (tokenA === tokenB) {
            return;
          }

          if (!pairs.has(tokenA)) {
            pairs.set(tokenA, []);
          }

          pairs.get(tokenA)?.push(tokenB);
        });
      });

      return pairs;
    },
    quote: async (entry, destination, amount) => {
      const pools = await loadPools();

      if (
        pools.find(
          pool =>
            (pool[0].toLowerCase() === entry.toLowerCase() &&
              pool[1].toLowerCase() === destination.toLowerCase()) ||
            (pool[0].toLowerCase() === destination.toLowerCase() &&
              pool[1].toLowerCase() === entry.toLowerCase()),
        )
      ) {
        const plan = await makePlan(
          entry,
          destination,
          BigNumber.from(amount),
          0.1,
        );
        const impact = await plan.impact;
        return utils.parseEther(impact.buyQty);
      } else {
        // otherwise, use long form orders to build multi-hop swaps

        const graph = constructGraph(pools);
        const path = bfsShortestPath(graph, entry, destination);

        const poolCount = Math.ceil((path?.length ?? 0) / 2);

        if (poolCount < 2) {
          throw makeError(
            `Cannot swap ${entry} to ${destination}; #1`,
            SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
          );
        }

        const env = new CrocEnv(provider);
        const context = await env.context;

        const entryAmount = await parseAmount(env, entry, amount);

        const poolIndex = context.chain.poolIndex;

        const groupedPath = groupItemsInPairs(path ?? []);

        const ambientPools = await Promise.all(
          groupedPath.map(item => env.pool(item[0], item[1], poolIndex)), // todo: detect pool index
        );

        if (ambientPools.length === 0) {
          throw makeError(
            `Cannot swap ${entry} to ${destination}; #2`,
            SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
          );
        }

        let lastOut = await calculateImpact(
          env,
          ambientPools[0],
          poolIndex,
          entry,
          entryAmount,
        );

        for (let i = 1; i < ambientPools.length; i++) {
          const pool = ambientPools[i];
          const poolPath = groupedPath[i];

          lastOut = await calculateImpact(
            env,
            pool,
            poolIndex,
            poolPath[0],
            lastOut.amount,
          );
        }

        return Decimal.fromBigNumberString(
          lastOut.amount.toString(),
        ).toBigNumber();
      }
    },
    approve: async (entry, destination, amount, from, overrides) => {
      if (entry === constants.AddressZero) {
        return undefined;
      }

      const env = new CrocEnv(provider);
      const context = await env.context;

      const parsedAmount = await parseAmount(env, entry, amount);

      if (
        await hasEnoughAllowance(
          provider,
          entry,
          from,
          context.dex.address, // Use the contract address directly
          parsedAmount ?? constants.MaxUint256,
        )
      ) {
        return undefined;
      }

      return {
        ...makeApproveRequest(
          entry,
          context.dex.address, // Use the contract address directly
          parsedAmount ?? constants.MaxUint256,
        ),
        ...overrides,
      };
    },
    permit: async () => Promise.resolve(undefined),
    swap: async (entry, destination, amount, from, options, overrides) => {
      const slippage = Number(options?.slippage ?? 10) / 1000;

      const pools = await loadPools();

      // if there is a pool for the pair, use it
      if (
        pools.find(
          pool =>
            (pool[0].toLowerCase() === entry.toLowerCase() &&
              pool[1].toLowerCase() === destination.toLowerCase()) ||
            (pool[0].toLowerCase() === destination.toLowerCase() &&
              pool[1].toLowerCase() === entry.toLowerCase()),
        )
      ) {
        const plan = await makePlan(entry, destination, BigNumber.from(amount));
        const txData = await plan.generateSwapData({ from: from });

        return {
          to: txData.to,
          data: txData.data,
          value: txData.value,
          ...overrides,
        };
      } else {
        // otherwise, use long form orders to build multi-hop swaps

        const graph = constructGraph(pools);
        const path = bfsShortestPath(graph, entry, destination);

        const poolCount = Math.ceil((path?.length ?? 0) / 2);

        if (poolCount < 2) {
          throw makeError(
            `Cannot swap ${entry} to ${destination}; #1`,
            SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
          );
        }

        const env = new CrocEnv(provider);
        const context = await env.context;

        const entryAmount = await parseAmount(env, entry, amount);

        const poolIndex = context.chain.poolIndex;
        const proxyPath = context.chain.proxyPaths.long;

        const groupedPath = groupItemsInPairs(path ?? []);

        const ambientPools = await Promise.all(
          groupedPath.map(item => env.pool(item[0], item[1], poolIndex)), // todo: detect pool index
        );

        if (ambientPools.length === 0) {
          throw makeError(
            `Cannot swap ${entry} to ${destination}; #2`,
            SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
          );
        }

        const order = new OrderDirective(ambientPools[0].baseToken.tokenAddr);
        order.open.useSurplus = false;

        const entryHop = order.appendHop(ambientPools[0].quoteToken.tokenAddr);
        entryHop.settlement.useSurplus = false;

        let lastOut = await setupPool(
          order,
          env,
          ambientPools[0],
          poolIndex,
          entry,
          entryAmount,
          slippage,
        );

        for (let i = 1; i < ambientPools.length; i++) {
          const pool = ambientPools[i];
          const poolPath = groupedPath[i];

          const baseHop = order.appendHop(pool.baseToken.tokenAddr);
          baseHop.settlement.useSurplus = false;

          const quoteHop = order.appendHop(pool.quoteToken.tokenAddr);
          quoteHop.settlement.useSurplus = false;

          lastOut = await setupPool(
            order,
            env,
            pool,
            poolIndex,
            poolPath[0],
            lastOut,
            slippage,
          );
        }

        const data = context.dex.interface.encodeFunctionData('userCmd', [
          proxyPath,
          order.encodeBytes(),
        ]);

        return {
          to: context.dex.address,
          data,
          value: entry === constants.AddressZero ? entryAmount : 0,
          ...overrides,
        };
      }
    },
  };
};

const calculateImpact = async (
  env: CrocEnv,
  pool: CrocPoolView,
  poolIndex: number,
  entry: string,
  amount: BigNumber,
): Promise<{ amount: BigNumber; isBuy: boolean }> => {
  const isBuy = pool.baseToken.tokenAddr.toLowerCase() === entry.toLowerCase();

  const impact = await calcImpact(
    env,
    pool.baseToken.tokenAddr,
    pool.quoteToken.tokenAddr,
    poolIndex,
    isBuy,
    isBuy,
    amount,
  );

  const entryOut = Decimal.fromBigNumberString(
    isBuy ? impact.quoteFlow : impact.baseFlow,
  )
    .abs()
    .toBigNumber();

  return { amount: entryOut, isBuy };
};

const setupPool = async (
  order: OrderDirective,
  env: CrocEnv,
  pool: CrocPoolView,
  poolIndex: number,
  entry: string,
  amount: BigNumber,
  slippage: number,
) => {
  const orderPool = order.appendPool(poolIndex);
  orderPool.swap.isBuy =
    pool.baseToken.tokenAddr.toLowerCase() === entry.toLowerCase();
  orderPool.swap.inBaseQty = orderPool.swap.isBuy;
  orderPool.swap.qty = amount;

  const impact = await calcImpact(
    env,
    pool.baseToken.tokenAddr,
    pool.quoteToken.tokenAddr,
    poolIndex,
    orderPool.swap.isBuy,
    orderPool.swap.inBaseQty,
    orderPool.swap.qty,
  );

  orderPool.swap.limitPrice = Decimal.fromBigNumberString(impact.finalPrice)
    .mul(orderPool.swap.isBuy ? 1 + slippage : 1 - slippage)
    .toBigNumber();
  orderPool.swap.rollType = 0;
  orderPool.chain.rollExit = true;

  const entryOut = Decimal.fromBigNumberString(impact.baseFlow)
    .abs()
    .toBigNumber();

  return entryOut;
};

const parseAmount = async (
  env: CrocEnv,
  token: string,
  amount: BigNumberish,
) => {
  const entryToken = await env.tokens.materialize(token);
  const entryTokenDecimals = await entryToken.decimals;

  return utils.parseUnits(utils.formatEther(amount), entryTokenDecimals);
};
