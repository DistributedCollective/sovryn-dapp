import { BigNumber, utils, providers, constants, BigNumberish } from 'ethers';

import { CrocEnv, CrocPoolView } from '@sovryn/ambient-sdk';
import { OrderDirective } from '@sovryn/ambient-sdk/dist/encoding/longform';
import { getAssetContract } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';
import { numberToChainId } from '@sovryn/ethers-provider';
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

  const loadPools = async () => {
    const chainId = await getChainId();

    // testing for sepolia fork...
    if (chainId === ChainIds.SEPOLIA) {
      const eth = (await getAssetContract('ETH', chainId)).address;
      const usdc = (await getAssetContract('USDC', chainId)).address;
      const wbtc = (await getAssetContract('WBTC', chainId)).address;
      const okb = (await getAssetContract('OKB', chainId)).address;
      const pools: Pool[] = [
        [eth, usdc],
        [eth, wbtc],
        [eth, okb],
      ];

      return pools;
    }

    const eth = (await getAssetContract('ETH', chainId)).address;
    const sov = (await getAssetContract('SOV', chainId)).address;
    const gld = (await getAssetContract('GLD', chainId)).address;
    const pools: Pool[] = [
      [eth, sov],
      [eth, gld],
    ];

    return pools;
  };

  return {
    name: 'Ambient',
    // todo: remove sepolia before release
    chains: [ChainIds.BOB_MAINNET, ChainIds.BOB_TESTNET, ChainIds.SEPOLIA],
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
      try {
        const plan = await makePlan(entry, destination, BigNumber.from(amount));
        const impact = await plan.impact;

        // @dev multihop pairs has no price, for now we return 1
        // @todo: implement multihop pair quote
        if (impact.buyQty === '0.0') {
          return utils.parseEther('1');
        }

        return utils.parseEther(impact.buyQty);
      } catch (e) {
        console.warn('Error getting quote', e);
        return utils.parseEther('1');
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
      console.log('amount', amount.toString());

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
        console.log('Using pool for swap');
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
        console.log('Long form swap not implemented yet');

        const graph = constructGraph(pools);
        console.log('Graph:', graph);
        const path = bfsShortestPath(graph, entry, destination);
        console.log('Path:', path);

        const poolCount = Math.ceil((path?.length ?? 0) / 2);
        console.log('Pool count:', poolCount);

        if (poolCount < 2) {
          console.error('Found paths: ' + poolCount, ' Path: ', path);
          throw makeError(
            `Cannot swap ${entry} to ${destination}; #1`,
            SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
          );
        }

        const env = new CrocEnv(provider);
        const context = await env.context;

        const entryAmount = await parseAmount(env, entry, amount);

        console.log('Entry Amount:', entryAmount.toString());

        const poolIndex = context.chain.poolIndex;
        const proxyPath = context.chain.proxyPaths.long;

        const groupedPath = groupItemsInPairs(path ?? []);

        const ambientPools = await Promise.all(
          groupedPath.map(item => env.pool(item[0], item[1])),
        );

        console.log('Ambient Pools:', ambientPools);

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

        console.log('Entry Out:', lastOut);

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

          console.log('Pool Out:', i, lastOut);
        }

        console.log('Order:', order);

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

  console.log('Pool:', orderPool, pool, entry, amount, slippage);

  const impact = await calcImpact(
    env,
    pool.baseToken.tokenAddr,
    pool.quoteToken.tokenAddr,
    poolIndex,
    orderPool.swap.isBuy,
    orderPool.swap.inBaseQty,
    orderPool.swap.qty,
  );

  console.log('Impact:', impact);

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
