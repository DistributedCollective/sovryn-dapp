import { CrocEnv, MAX_SQRT_PRICE, MIN_SQRT_PRICE } from '@sovryn/ambient-sdk';
import { BigNumber } from 'ethers';

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
  const context = await env.context;
  return await context.slipQuery.calcImpact(
    base,
    quote,
    poolIdx,
    isBuy,
    inBaseQty,
    qty,
    0,
    initialLimitPrice(isBuy),
  );
};
