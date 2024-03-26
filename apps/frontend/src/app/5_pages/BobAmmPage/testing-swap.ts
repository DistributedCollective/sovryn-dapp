import { CrocEnv, MAX_SQRT_PRICE, MIN_SQRT_PRICE } from '@sovryn/ambient-sdk';

import { OrderDirective } from '@sovryn/ambient-sdk/src/encoding/longform';
import { ETH_TOKEN, USDC_TOKEN, WBTC_TOKEN } from './fork-constants';
import { BigNumber } from 'ethers';
import { Decimal } from '@sovryn/utils';

const SLIPPDAGE = 0.1;

// Reference
// https://github.com/busimus/ars/blob/main/frontend/src/App.vue#L537-L562
// https://github.com/CrocSwap/sdk/blob/main/src/recipes/reposition.ts
// https://github.com/DistributedCollective/Ambient-DEX/blob/feat/deployment-init/test/FacadePool.ts#L606
// https://github.com/CrocSwap/ambient-ts-app/blob/aa39b19b2c6e1b86c28d37ffa3a74f5031adadf0/src/pages/Trade/Reposition/Reposition.tsx#L135
// https://github.com/CrocSwap/CrocSwap-protocol/blob/8a273515be92dd4e28e4c51a86097e8d35bc48ad/test/TestEncoding.ts#L8

const ENTRY = ETH_TOKEN;
const NEXT = USDC_TOKEN;
const END = WBTC_TOKEN;

// SOV -> GLD
export const multiSwap = async (env: CrocEnv) => {
  const ENTRY_AMOUNT = await env.token(NEXT).normQty(1);

  console.log({ ENTRY_AMOUNT: ENTRY_AMOUNT.toString() });

  const POOL_INDEX = (await env.context).chain.poolIndex;
  const PATH = (await env.context).chain.proxyPaths.long;

  // const t = env.tokens.materialize(ENTRY);
  // const e = await t.approve();
  // await e?.wait();

  // entry
  const order = new OrderDirective(ENTRY);
  order.open.useSurplus = true;

  // HOP 1:
  const hop = order.appendHop(NEXT);
  hop.settlement.useSurplus = true;

  const pool = order.appendPool(POOL_INDEX);

  const buy = false;

  pool.swap.isBuy = buy;
  pool.swap.inBaseQty = buy;
  pool.swap.qty = ENTRY_AMOUNT;

  const { finalPrice } = await calcImpact(
    env,
    ENTRY,
    NEXT,
    POOL_INDEX,
    pool.swap.isBuy,
    pool.swap.inBaseQty,
    ENTRY_AMOUNT,
  );

  pool.swap.limitPrice = Decimal.fromBigNumberString(finalPrice)
    .mul(buy ? 1 + SLIPPDAGE : 1 - SLIPPDAGE)
    .toBigNumber();
  // @dev https://github.com/CrocSwap/CrocSwap-protocol/blob/8a273515be92dd4e28e4c51a86097e8d35bc48ad/contracts/libraries/Chaining.sol#L28
  pool.swap.rollType = 0;

  console.log('price', pool.swap.limitPrice.toString());

  pool.chain.rollExit = true;

  // pool.chain.rollType = 0;

  // const POOL_1 = getPool(env, ENTRY, NEXT);
  // const PRICE_1 = await POOL_1.displayPrice();

  // const POOL_1_INFO = await POOL_1.context;
  // const POOL_1_CURVE = await POOL_1_INFO.query.queryCurve(
  //   ENTRY,
  //   NEXT,
  //   POOL_INDEX,
  // );

  // console.log({ price: PRICE_1, poolInfo: POOL_1_INFO, curve: POOL_1_CURVE });

  // const pool1 = order.appendPool(POOL_INDEX);
  // pool1.chain.swapDefer = true;
  // pool1.swap.rollType = 4;
  // pool1.swap.isBuy = true;
  // pool1.swap.qty = ENTRY_AMOUNT;

  // const priceMult = 1 + SLIPPDAGE; // or 1 - SLIPPDAGE

  // const limitPrice = encodeCrocPrice(PRICE_1 * priceMult);

  // pool1.swap.limitPrice = limitPrice;

  // // // HOP 2:
  // directive.appendHop(NEXT);

  // const POOL_2 = getPool(env, NEXT, END);
  // const PRICE_2 = await POOL_2.displayPrice();

  // const POOL_2_INFO = await POOL_2.context;
  // const POOL_2_CURVE = await POOL_2_INFO.query.queryCurve(
  //   NEXT,
  //   END,
  //   POOL_INDEX,
  // );

  // console.log({
  //   price: PRICE_2,
  //   poolInfo: POOL_2_INFO,
  //   limitPrice,
  //   curve: POOL_2_CURVE,
  // });

  // const pool2 = directive.appendPool(POOL_INDEX);
  // pool2.chain.swapDefer = true;
  // pool2.swap.rollType = 4;
  // pool2.swap.isBuy = true;
  // pool2.swap.qty = ENTRY_AMOUNT;

  // const limitPrice_2 = encodeCrocPrice(PRICE_2 * priceMult);

  // pool2.swap.limitPrice = limitPrice_2;

  // console.log({
  //   directive,
  //   limitPrice: limitPrice_2.toString(),
  //   priceRoot_: POOL_2_CURVE.priceRoot_.toString(),
  // });

  console.log('ORDER: ', order);

  const bytes = order.encodeBytes();

  let value = BigNumber.from(0);
  if (ENTRY === ETH_TOKEN) {
    value = ENTRY_AMOUNT;
  }

  const tx = await (
    await env.context
  ).dex?.userCmd(PATH, bytes, { gasLimit: 6_000_000 });
  console.log({ tx });

  const result = await tx?.wait();

  console.log(result.status ? true : false, result);

  return result;
};

const getPool = (env: CrocEnv, base: string, quote: string) =>
  env.pool(base, quote);

const initialLimitPrice = (isBuy: boolean) =>
  isBuy ? MAX_SQRT_PRICE : MIN_SQRT_PRICE;

const calcImpact = async (
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
