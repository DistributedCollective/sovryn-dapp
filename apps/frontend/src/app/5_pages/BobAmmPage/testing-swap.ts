import { CrocEnv, encodeCrocPrice } from '@sovryn/ambient-sdk';

import { OrderDirective } from '@sovryn/ambient-sdk/src/encoding/longform';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { ETH_TOKEN, USDC_TOKEN, WBTC_TOKEN } from './fork-constants';

const SLIPPDAGE = 0.01;

// Reference
// https://github.com/CrocSwap/sdk/blob/main/src/recipes/reposition.ts
// https://github.com/DistributedCollective/Ambient-DEX/blob/feat/deployment-init/test/FacadePool.ts#L606
// https://github.com/CrocSwap/ambient-ts-app/blob/aa39b19b2c6e1b86c28d37ffa3a74f5031adadf0/src/pages/Trade/Reposition/Reposition.tsx#L135
// https://github.com/CrocSwap/CrocSwap-protocol/blob/8a273515be92dd4e28e4c51a86097e8d35bc48ad/test/TestEncoding.ts#L8

const ENTRY = ETH_TOKEN;
const NEXT = USDC_TOKEN;
const END = WBTC_TOKEN;

// SOV -> GLD
export const multiSwap = async (env: CrocEnv) => {
  const ENTRY_AMOUNT = parseUnits('0.1', 18);
  const POOL_INDEX = (await env.context).chain.poolIndex;

  // const t = env.tokens.materialize(ENTRY);
  // const e = await t.approve();
  // await e?.wait();

  // entry
  const directive = new OrderDirective(ENTRY);

  // HOP 1:
  directive.appendHop(NEXT);

  const POOL_1 = getPool(env, ENTRY, NEXT);
  const PRICE_1 = await POOL_1.displayPrice();

  const POOL_1_INFO = await POOL_1.context;
  const POOL_1_CURVE = await POOL_1_INFO.query.queryCurve(
    ENTRY,
    NEXT,
    POOL_INDEX,
  );

  console.log({ price: PRICE_1, poolInfo: POOL_1_INFO, curve: POOL_1_CURVE });

  const pool1 = directive.appendPool(POOL_INDEX);
  pool1.chain.swapDefer = true;
  pool1.swap.rollType = 4;
  pool1.swap.isBuy = true;
  pool1.swap.qty = ENTRY_AMOUNT;

  const priceMult = 1 + SLIPPDAGE; // or 1 - SLIPPDAGE

  const limitPrice = await POOL_1.baseToken.normQty(PRICE_1 * priceMult);

  pool1.swap.limitPrice = limitPrice;

  // HOP 2:
  directive.appendHop(END);

  const POOL_2 = getPool(env, ENTRY, END);
  const PRICE_2 = await POOL_2.displayPrice();

  const POOL_2_INFO = await POOL_2.context;
  const POOL_2_CURVE = await POOL_2_INFO.query.queryCurve(
    ENTRY,
    END,
    POOL_INDEX,
  );

  console.log({ price: PRICE_2, poolInfo: POOL_2_INFO, curve: POOL_2_CURVE });

  const pool2 = directive.appendPool(POOL_INDEX);
  pool2.chain.swapDefer = true;
  pool2.swap.rollType = 4;
  pool2.swap.isBuy = true;
  pool2.swap.qty = ENTRY_AMOUNT;

  const limitPrice_2 = await POOL_1.baseToken.normQty(PRICE_2 * priceMult);

  pool2.swap.limitPrice = limitPrice_2;

  console.log({
    directive,
    limitPrice: limitPrice_2.toString(),
    priceRoot_: POOL_2_CURVE.priceRoot_.toString(),
  });

  const bytes = directive.encodeBytes();

  const tx = await (
    await env.context
  ).dex?.userCmd(4, bytes, { gasLimit: 6_000_000, value: ENTRY_AMOUNT });
  console.log({ tx });

  const result = await tx?.wait();

  console.log(result.status ? true : false, result);

  return result;
};

const enters = () => {};

const getPool = (env: CrocEnv, base: string, quote: string) =>
  env.pool(base, quote);
