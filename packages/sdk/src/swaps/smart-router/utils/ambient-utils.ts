import { BigNumber } from 'ethers';

import { getAssetContract, getAssetDataByAddress } from '@sovryn/contracts';
import { ChainId, ChainIds } from '@sovryn/ethers-provider';
import { CrocEnv, logger, MAX_SQRT_PRICE, MIN_SQRT_PRICE } from '@sovryn/sdex';

export type PoolWithIndex = [string, string, number];
export type Pool = [string, string];

type Graph = Map<string, string[]>;

// Function to construct a graph from the token pools
export const constructGraph = (pools: Pool[]): Graph => {
  const graph: Graph = new Map();

  pools.forEach(pool => {
    const [a, b] = pool;
    if (!graph.has(a)) graph.set(a, []);
    if (!graph.has(b)) graph.set(b, []);

    graph.get(a)?.push(b);
    graph.get(b)?.push(a); // Since the pools are bidirectional
  });

  return graph;
};

// BFS function to find the shortest path from start to goal in terms of pools
export const bfsShortestPath = (
  graph: Graph,
  start: string,
  goal: string,
): string[] | undefined => {
  const visited: Set<string> = new Set([start]);
  const queue: [string, string[]][] = [[start, [start]]]; // Queue of [vertex, path]

  while (queue.length > 0) {
    const [currentNode, path] = queue.shift()!;

    if (currentNode === goal) {
      return path; // Return the first path found to the goal
    }

    graph.get(currentNode)?.forEach(neighbor => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    });
  }
};

export function groupItemsInPairs<T>(items: T[]): T[][] {
  const groupedItems: T[][] = [];

  for (let i = 0; i < items.length - 1; i++) {
    groupedItems.push([items[i], items[i + 1]]);
  }

  return groupedItems;
}

// for some reason some pairs are failing when using these values in calcImpact
const initialLimitPrice = (isBuy: boolean) =>
  isBuy ? MAX_SQRT_PRICE : MIN_SQRT_PRICE;

export const calcImpact = async (
  env: CrocEnv,
  base: string,
  quote: string,
  poolIdx: number,
  isBuy: boolean,
  inBaseQty: boolean,
  qty: BigNumber,
) => {
  try {
    const context = await env.context;
    const result = await context.slipQuery.calcImpact(
      base,
      quote,
      poolIdx,
      isBuy,
      inBaseQty,
      qty,
      0,
      initialLimitPrice(isBuy),
    );

    return result;
  } catch (error) {
    logger('error', 'calcImpact', {
      data: {
        error,
        base,
        quote,
        poolIdx,
        isBuy,
        inBaseQty,
        qty,
        initialLimitPrice: initialLimitPrice(isBuy),
        env,
      },
      dataFormatted: {
        error,
        base,
        quote,
        poolIdx,
        isBuy,
        inBaseQty,
        qty: qty.toString(),
        initialLimitPrice: initialLimitPrice(isBuy).toString(),
        network: process.env.REACT_APP_NETWORK,
        env,
      },
    });
  }
};

const INDEXER = {
  [ChainIds.BOB_MAINNET]:
    'https://bob-ambient-graphcache.sovryn.app/gcgo/pool_list',
  [ChainIds.BOB_TESTNET]:
    'https://bob-ambient-graphcache.test.sovryn.app/gcgo/pool_list',
  [ChainIds.SEPOLIA]:
    'https://sepolia-ambient-graphcache.test.sovryn.app/gcgo/pool_list',
};

// Fetch pools from the indexer and return list of pairs if assets are supported by chain
export const fetchPoolsFromIndexer = async (chainId: ChainId) => {
  if (!INDEXER[chainId]) return [];
  const response = await fetch(`${INDEXER[chainId]}?chainId=${chainId}`);
  const pools = await response
    .json()
    .then(response =>
      (response.data ?? []).map(item => [item.base, item.quote, item.poolIdx]),
    );

  // const pools = [
  //   [
  //     '0x0F004Fd9e9e1f884975908137F5494C3cA1D9914',
  //     '0x395131c2360101acB9Fa8a4d412b0bc43607DF22',
  //     36000,
  //   ],
  //   [
  //     '0x395131c2360101acB9Fa8a4d412b0bc43607DF22', // USDT
  //     '0x412342D0537B2d5F21E513Cf6C7bFb92D433a813', // DLLR
  //     36000,
  //   ],
  //   [
  //     '0x39F696fC50a39E26c93c903eeF1fff1Df5c392C4', //DAI
  //     '0x412342D0537B2d5F21E513Cf6C7bFb92D433a813', // DLLR
  //     36000,
  //   ],
  //   [
  //     '0x0000000000000000000000000000000000000000', // ERH
  //     '0xebE5E8866db71286242af5fbF64e9464596a40F2', // SOV
  //     36000,
  //   ],
  //   [
  //     '0x412342D0537B2d5F21E513Cf6C7bFb92D433a813', //dLLR
  //     '0xebE5E8866db71286242af5fbF64e9464596a40F2',
  //     36000,
  //   ],
  // ] as PoolWithIndex[];

  const items: PoolWithIndex[] = [];
  for (const pool of pools) {
    const [base, quote, index] = pool;
    const baseAsset = await getAssetDataByAddress(base, chainId).catch(
      () => null,
    );
    const quoteAsset = await getAssetDataByAddress(quote, chainId).catch(
      () => null,
    );

    if (!baseAsset || !quoteAsset) continue;
    items.push([baseAsset.address, quoteAsset.address, index]);
  }

  return items;
};

const POOLS: Partial<Record<ChainIds, PoolWithIndex[]>> = {
  [ChainIds.BOB_MAINNET]: [
    ['USDC', 'USDT', 400],
    ['USDT', 'DLLR', 400],
    ['DLLR', 'SOV', 400],
    ['USDT', 'SOV', 410],
    ['USDC', 'SOV', 410],
    ['DAI', 'SOV', 410],
    ['ETH', 'SOV', 410],
    ['WSTETH', 'SOV', 410],
    ['RETH', 'SOV', 410],
    ['WBTC', 'SOV', 410],
    ['TBTC', 'SOV', 410],
    ['TBTC', 'WBTC', 400],
    ['POWA', 'SOV', 420],
    ['MOCK_GOB', 'MOCK_POWA', 420],
    ['MOCK2_WETH', 'MOCK2_SOV', 410],
  ],
  [ChainIds.BOB_TESTNET]: [
    ['USDC', 'USDT', 36000],
    ['DAI', 'DLLR', 36000],
    ['USDT', 'DLLR', 36000],
    ['TBTC', 'WBTC', 36000],
    ['RETH', 'ETH', 36000],
    ['WSTETH', 'ETH', 36000],
    ['DLLR', 'SOV', 37000],
    ['USDT', 'SOV', 37000],
    ['USDC', 'SOV', 37000],
    ['DAI', 'SOV', 37000],
    ['ETH', 'SOV', 36000],
    ['WSTETH', 'SOV', 37000],
    ['RETH', 'SOV', 37000],
    ['WBTC', 'SOV', 37000],
    ['TBTC', 'SOV', 37000],
    ['POWA', 'SOV', 38000],
  ],
  [ChainIds.SEPOLIA]: [['USDC', 'USDT', 36000]],
};

export const fetchPools = async (chainId: ChainId) => {
  const items = await Promise.all(
    (POOLS[chainId] ?? []).map(async pool => [
      (await getAssetContract(pool[0], chainId)).address,
      (await getAssetContract(pool[1], chainId)).address,
      pool[2],
    ]),
  );
  return items.map(item => {
    const [base, quote] =
      item[0] < item[1] ? [item[0], item[1]] : [item[1], item[0]];
    return [base, quote, item[2]];
  }) as PoolWithIndex[];
};
