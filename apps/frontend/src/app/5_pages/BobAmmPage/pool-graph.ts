interface Pool {
  base: string;
  quote: string;
}

type Graph = Map<string, Pool[]>;

const pools: Pool[] = [
  { base: 'ETH', quote: 'SOV' },
  { base: 'ETH', quote: 'USDC' },
  { base: 'ETH', quote: 'WBTC' },
];

// Function to construct a graph from the token pools
const constructGraph = (pools: Pool[]): Graph => {
  const graph: Graph = new Map();

  pools.forEach(pool => {
    const { base, quote } = pool;
    if (!graph.has(base)) graph.set(base, []);
    if (!graph.has(quote)) graph.set(quote, []);

    graph.get(base)?.push(pool);
    graph.get(quote)?.push({ ...pool, base: pool.quote, quote: pool.base }); // Add reversed pool for bidirectionality
  });

  return graph;
};

// BFS function to find the shortest path from start to goal in terms of pools
export const bfsShortestPath = (
  graph: Graph,
  start: string,
  goal: string,
): Pool[] | undefined => {
  const visited: Set<string> = new Set([start]);
  const queue: [string, Pool[]][] = [[start, []]]; // Queue of [vertex, path] where path is an array of pools

  while (queue.length > 0) {
    const [currentNode, path] = queue.shift()!;

    if (currentNode === goal) {
      return path; // Return the first path found to the goal
    }

    graph.get(currentNode)?.forEach(pool => {
      const neighbor = pool.quote === currentNode ? pool.base : pool.quote; // Determine the next token
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, pool]]);
      }
    });
  }
};

// Constructing the graph from the token pools
export const graph = constructGraph(pools);

// Finding the most efficient conversion path from 'B' to 'C'
const conversionPath1 = bfsShortestPath(graph, 'ETH', 'USDC');

console.log(conversionPath1);
