import { BigNumber, utils, providers, constants, BigNumberish } from 'ethers';

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
  PoolWithIndex,
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
    poolIndex: number,
    _amount: BigNumber,
    slippage?: number,
  ) => {
    const env = new CrocEnv(provider);

    const amount = await parseAmount(env, entry, _amount);

    return env
      .sell(entry, BigNumber.from(amount), poolIndex)
      .for(destination, { slippage });
  };

  const poolCache: Record<string, PoolWithIndex[]> = {};
  const loadPools = async () => {
    const chainId = await getChainId();
    if (!poolCache[chainId]) {
      const pools = await fetchPools(chainId);
      poolCache[chainId] = pools;
    }

    return poolCache[chainId];
  };

  const findPair = (chainId: string, base: string, quote: string) => {
    const pools = poolCache[chainId] ?? [];
    return pools.find(
      pool =>
        (pool[0].toLowerCase() === base.toLowerCase() &&
          pool[1].toLowerCase() === quote.toLowerCase()) ||
        (pool[0].toLowerCase() === quote.toLowerCase() &&
          pool[1].toLowerCase() === base.toLowerCase()),
    );
  };

  return {
    name: 'Ambient',
    chains: [ChainIds.BOB_MAINNET, ChainIds.BOB_TESTNET, ChainIds.SEPOLIA],
    pairs: async () => {
      const pools = await loadPools();

      const uniqueTokens = new Set<string>();
      pools.forEach(pool =>
        [pool[0], pool[1]].forEach(token => uniqueTokens.add(token)),
      );
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
      const chainId = await getChainId();
      const pools = await loadPools();

      const pair = findPair(chainId, entry, destination);

      if (pair) {
        const plan = await makePlan(
          entry,
          destination,
          pair[2],
          BigNumber.from(amount),
          1,
        );
        const impact = await plan.impact;

        console.table(impact);

        return utils.parseEther(impact.buyQty);
      } else {
        // otherwise, use long form orders to build multi-hop swaps

        const graph = constructGraph(pools.map(p => [p[0], p[1]]));
        const path = bfsShortestPath(graph, entry, destination);

        const poolCount = Math.ceil((path?.length ?? 0) / 2);

        if (poolCount < 1) {
          throw makeError(
            `Cannot swap ${entry} to ${destination}; #1`,
            SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
          );
        }

        const env = new CrocEnv(provider);

        const entryAmount = await parseAmount(env, entry, amount);

        const groupedPath = groupItemsInPairs(path ?? []);
        const pathsToPoolsWithIndexes = groupedPath.map(item => {
          const index = findPair(chainId, item[0], item[1])?.[2]!;
          return [item[0], item[1], index] as PoolWithIndex;
        });

        const ambientPools = await Promise.all(
          pathsToPoolsWithIndexes.map(item =>
            env.pool(item[0], item[1], item[2]),
          ),
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
          ambientPools[0].poolIndex,
          entry,
          entryAmount,
        ).catch(e => {
          console.error('Error calculating impact (init)', e, [
            ambientPools[0],
            entry,
            entryAmount,
          ]);
          return { amount: BigNumber.from(0), isBuy: true, impact: {} };
        });

        for (let i = 1; i < ambientPools.length; i++) {
          const pool = ambientPools[i];
          const poolPath = groupedPath[i];

          const prev = lastOut;

          lastOut = await calculateImpact(
            env,
            pool,
            pool.poolIndex,
            poolPath[0],
            prev.amount,
          ).catch(e => {
            console.warn('Error calculating impact', i, e, [
              pool,
              poolPath[0],
              prev.amount,
            ]);
            return { amount: BigNumber.from(0), isBuy: true, impact: {} };
          });
        }

        const decimals = await env.tokens.materialize(destination).decimals;

        return BigNumber.from(lastOut.amount.toString()).mul(
          Math.pow(10, 18 - decimals),
        );
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
      const slippage = Number(options?.slippage ?? 50) / 1000;

      const pools = await loadPools();
      const chainId = await getChainId();

      const pair = await findPair(chainId, entry, destination);

      // if there is a pool for the pair, use it
      if (pair) {
        const plan = await makePlan(
          entry,
          destination,
          pair[2],
          BigNumber.from(amount),
          slippage,
        );
        const txData = await plan.generateSwapData({ from: from });

        return {
          to: txData.to,
          data: txData.data,
          value: txData.value,
          ...overrides,
        };
      } else {
        // otherwise, use long form orders to build multi-hop swaps

        const graph = constructGraph(pools.map(p => [p[0], p[1]]));
        const path = bfsShortestPath(graph, entry, destination);

        const poolCount = Math.ceil((path?.length ?? 0) / 2);

        if (poolCount < 1) {
          throw makeError(
            `Cannot swap ${entry} to ${destination}; #1`,
            SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
          );
        }

        const env = new CrocEnv(provider);
        const context = await env.context;

        const entryAmount = await parseAmount(env, entry, amount);

        const proxyPath = context.chain.proxyPaths.long;

        const groupedPath = groupItemsInPairs(path ?? []);

        const pathsToPoolsWithIndexes = groupedPath.map(item => {
          const index = findPair(chainId, item[0], item[1])?.[2]!;
          return [item[0], item[1], index] as PoolWithIndex;
        });

        const ambientPools = await Promise.all(
          pathsToPoolsWithIndexes.map(item =>
            env.pool(item[0], item[1], item[2]),
          ),
        );

        if (ambientPools.length === 0) {
          throw makeError(
            `Cannot swap ${entry} to ${destination}; #2`,
            SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
          );
        }

        const order = new OrderDirective(ambientPools[0].baseToken.tokenAddr);

        const entryHop = order.appendHop(ambientPools[0].quoteToken.tokenAddr);

        let lastOut = await setupPool(
          order,
          env,
          ambientPools[0],
          ambientPools[0].poolIndex,
          entry,
          entryAmount,
          slippage,
        );

        // order.open.useSurplus = !lastOut.orderPool.swap.inBaseQty;
        // entryHop.settlement.useSurplus = lastOut.orderPool.swap.inBaseQty;

        // if it's single pool, entry and exit direct
        if (ambientPools.length === 1) {
          order.open.useSurplus = false;
          entryHop.settlement.useSurplus = false;
        } else {
          // if it's multi pool, entry direct, exit surplus

          const baseIsEntry =
            entry.toLowerCase() ===
            ambientPools[0].baseToken.tokenAddr.toLowerCase();

          // setting both true would also work, but would force user to always use surplus first
          // we may not want that atm.
          order.open.useSurplus = !baseIsEntry;
          entryHop.settlement.useSurplus = baseIsEntry;
        }

        for (let i = 1; i < ambientPools.length; i++) {
          const pool = ambientPools[i];
          const poolPath = groupedPath[i];

          const baseHop = order.appendHop(pool.baseToken.tokenAddr);
          baseHop.settlement.useSurplus = true;

          const quoteHop = order.appendHop(pool.quoteToken.tokenAddr);
          quoteHop.settlement.useSurplus = true;

          lastOut = await setupPool(
            order,
            env,
            pool,
            pool.poolIndex,
            poolPath[0],
            lastOut.entryOut,
            slippage,
          );

          // by default, use surplus for all intermediate pools
          baseHop.settlement.useSurplus = true;
          quoteHop.settlement.useSurplus = true;

          const isLastPool = i === ambientPools.length - 1;
          if (isLastPool) {
            const isBaseDestination =
              destination.toLowerCase() ===
              pool.baseToken.tokenAddr.toLowerCase();

            // works for DLLR -> USDT -> USDC swap
            baseHop.settlement.useSurplus = !isBaseDestination;
            quoteHop.settlement.useSurplus = isBaseDestination;
          }
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
): Promise<{ amount: BigNumber; isBuy: boolean; impact: any }> => {
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

  return { amount: entryOut, isBuy, impact };
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
  orderPool.poolIdx = poolIndex;

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

  const entryOut = Decimal.fromBigNumberString(
    orderPool.swap.isBuy ? impact.quoteFlow : impact.baseFlow,
  )
    .abs()
    .toBigNumber();

  return { entryOut, orderPool, impact };
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
