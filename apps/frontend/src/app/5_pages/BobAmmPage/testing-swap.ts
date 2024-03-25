import { CrocEnv, encodeCrocPrice } from '@sovryn/ambient-sdk';

import { OrderDirective } from '@sovryn/ambient-sdk/src/encoding/longform';
import { parseEther } from 'ethers/lib/utils';
import { ETH_TOKEN, USDC_TOKEN } from './fork-constants';

const SLIPPDAGE = 0.1;

// Reference
// https://github.com/CrocSwap/sdk/blob/main/src/recipes/reposition.ts
// https://github.com/DistributedCollective/Ambient-DEX/blob/feat/deployment-init/test/FacadePool.ts#L606
// https://github.com/CrocSwap/ambient-ts-app/blob/aa39b19b2c6e1b86c28d37ffa3a74f5031adadf0/src/pages/Trade/Reposition/Reposition.tsx#L135
// https://github.com/CrocSwap/CrocSwap-protocol/blob/8a273515be92dd4e28e4c51a86097e8d35bc48ad/test/TestEncoding.ts#L8

const ENTRY = ETH_TOKEN;
const NEXT = USDC_TOKEN;

// SOV -> GLD
export const multiSwap = async (env: CrocEnv) => {
  const ENTRY_AMOUNT = parseEther('0.01');
  const POOL_INDEX = (await env.context).chain.poolIndex;

  // entry
  const directive = new OrderDirective(ENTRY);

  // SOV->ETH
  directive.appendHop(NEXT);

  const POOL_1 = getPool(env, ENTRY, NEXT);
  const price = await POOL_1.displayPrice();

  console.log({ price });

  const POOL_1_INFO = await POOL_1.context;
  const POOL_1_CURVE = await POOL_1_INFO.query.queryCurve(
    ENTRY,
    NEXT,
    POOL_INDEX,
  );

  console.log({ price, poolInfo: POOL_1_INFO, curve: POOL_1_CURVE });

  const pool1 = directive.appendPool(POOL_INDEX);
  // pool1.chain.swapDefer = true;
  // pool1.swap.rollType = 4;
  pool1.swap.isBuy = false;
  pool1.swap.qty = ENTRY_AMOUNT;

  const priceMult = 1 + SLIPPDAGE; // or 1 - SLIPPDAGE

  const limitPrice = await POOL_1.baseToken.normQty(price * priceMult);

  pool1.swap.limitPrice = limitPrice;
  // pool1.swap.limitPrice = encodeCrocPrice(price * priceMult);

  // // ETH->GLD
  // directive.appendHop(GLD);
  // directive.appendPool(3600);

  console.log({
    directive,
    limitPrice: limitPrice.toString(),
    priceRoot_: POOL_1_CURVE.priceRoot_.toString(),
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

const getPool = (env: CrocEnv, base: string, quote: string) =>
  env.pool(base, quote);
