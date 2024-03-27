import { CrocEnv, MAX_SQRT_PRICE, MIN_SQRT_PRICE } from '@sovryn/ambient-sdk';

import { OrderDirective } from '@sovryn/ambient-sdk/src/encoding/longform';
import { ETH_TOKEN, OKB_TOKEN, USDC_TOKEN, WBTC_TOKEN } from './fork-constants';
import { BigNumber } from 'ethers';
import { Decimal } from '@sovryn/utils';
import { CrocTokenView } from '@sovryn/ambient-sdk/dist/tokens';

const SLIPPDAGE = 0.1;

// Reference
// https://github.com/busimus/ars/blob/main/frontend/src/App.vue#L537-L562
// https://github.com/CrocSwap/sdk/blob/main/src/recipes/reposition.ts
// https://github.com/DistributedCollective/Ambient-DEX/blob/feat/deployment-init/test/FacadePool.ts#L606
// https://github.com/CrocSwap/ambient-ts-app/blob/aa39b19b2c6e1b86c28d37ffa3a74f5031adadf0/src/pages/Trade/Reposition/Reposition.tsx#L135
// https://github.com/CrocSwap/CrocSwap-protocol/blob/8a273515be92dd4e28e4c51a86097e8d35bc48ad/test/TestEncoding.ts#L8

// USDC -> OKB
export const multiSwap = async (
  env: CrocEnv,
  signer: string,
  isBuy: boolean, // true = use ethereum (base), false = use token (quote)
) => {
  const useSurplus = false;

  const ENTRY_AMOUNT_1 = await env.token(USDC_TOKEN).normQty(20);

  console.log({ ENTRY_AMOUNT: ENTRY_AMOUNT_1.toString() });

  await testAllowance(
    signer,
    env.tokens.materialize(USDC_TOKEN),
    ENTRY_AMOUNT_1,
  );

  const POOL_INDEX = (await env.context).chain.poolIndex;
  const PATH = (await env.context).chain.proxyPaths.long;

  // entry
  const order = new OrderDirective(ETH_TOKEN);
  order.open.useSurplus = useSurplus;

  // HOP 1:
  const hop_1 = order.appendHop(USDC_TOKEN);
  hop_1.settlement.useSurplus = useSurplus;

  const pool_1 = order.appendPool(POOL_INDEX);

  const isBuy_1 = false;

  pool_1.swap.isBuy = isBuy_1;
  pool_1.swap.inBaseQty = isBuy_1;
  pool_1.swap.qty = ENTRY_AMOUNT_1;

  const impact_1 = await calcImpact(
    env,
    ETH_TOKEN,
    USDC_TOKEN,
    POOL_INDEX,
    pool_1.swap.isBuy,
    pool_1.swap.inBaseQty,
    ENTRY_AMOUNT_1,
  );

  console.log({ impact_1 });

  pool_1.swap.limitPrice = Decimal.fromBigNumberString(impact_1.finalPrice)
    .mul(isBuy_1 ? 1 + SLIPPDAGE : 1 - SLIPPDAGE)
    .toBigNumber();
  // @dev https://github.com/CrocSwap/CrocSwap-protocol/blob/8a273515be92dd4e28e4c51a86097e8d35bc48ad/contracts/libraries/Chaining.sol#L28
  pool_1.swap.rollType = 0;

  console.log('price', pool_1.swap.limitPrice.toString());

  pool_1.chain.rollExit = true;
  // pool.chain.rollType = 0;

  console.log(
    'out',
    Decimal.fromBigNumberString(impact_1.baseFlow).abs().toBigNumber(),
  );

  const OUT_1 = Decimal.fromBigNumberString(impact_1.baseFlow)
    .abs()
    .toBigNumber();

  console.log('out1', OUT_1.toString());

  // HOP 2:

  order.appendHop(ETH_TOKEN);
  const hop_2 = order.appendHop(OKB_TOKEN);
  hop_2.settlement.useSurplus = useSurplus;
  // hop_2.settlement.token = ETH_TOKEN;

  const pool_2 = order.appendPool(POOL_INDEX);

  const isBuy_2 = true;

  pool_2.swap.isBuy = isBuy_2;
  pool_2.swap.inBaseQty = isBuy_2;
  pool_2.swap.qty = OUT_1;

  const { finalPrice: finalPrice2 } = await calcImpact(
    env,
    ETH_TOKEN,
    OKB_TOKEN,
    POOL_INDEX,
    pool_2.swap.isBuy,
    pool_2.swap.inBaseQty,
    OUT_1,
  );

  pool_2.swap.limitPrice = Decimal.fromBigNumberString(finalPrice2)
    .mul(isBuy_2 ? 1 + SLIPPDAGE : 1 - SLIPPDAGE)
    .toBigNumber();
  // @dev https://github.com/CrocSwap/CrocSwap-protocol/blob/8a273515be92dd4e28e4c51a86097e8d35bc48ad/contracts/libraries/Chaining.sol#L28
  pool_2.swap.rollType = 0;

  console.log('price 2:', pool_2.swap.limitPrice.toString());

  pool_2.chain.rollExit = true;

  console.log('ORDER: ', order);

  const bytes = order.encodeBytes();

  // let value = BigNumber.from(0);
  // if useSurplus is enabled, we can send higher value than needed - it will be refunded.
  // if (ENTRY === ETH_TOKEN && isBuy) {
  //   value = ENTRY_AMOUNT;
  // }

  const tx = await (
    await env.context
  ).dex?.userCmd(PATH, bytes, { gasLimit: 6_000_000 });
  console.log({ tx });

  const result = await tx?.wait();

  console.log(result.status ? true : false, result);

  return result;
};

// export const lfoSwap = async (
//   env: CrocEnv,
//   signer: string,
//   isBuy: boolean, // true = use ethereum (base), false = use token (quote)
// ) => {
//   const useSurplus = true;

//   const TOKEN = isBuy ? ENTRY : NEXT;

//   const ENTRY_AMOUNT = await env.token(TOKEN).normQty(isBuy ? 0.0001 : 0.002);

//   console.log({ ENTRY_AMOUNT: ENTRY_AMOUNT.toString() });

//   await testAllowance(signer, env.tokens.materialize(TOKEN), ENTRY_AMOUNT);

//   const POOL_INDEX = (await env.context).chain.poolIndex;
//   const PATH = (await env.context).chain.proxyPaths.long;

//   // entry
//   const order = new OrderDirective(ENTRY);
//   order.open.useSurplus = useSurplus;

//   // HOP 1:
//   const hop = order.appendHop(NEXT);
//   hop.settlement.useSurplus = useSurplus;

//   const pool = order.appendPool(POOL_INDEX);

//   pool.swap.isBuy = isBuy;
//   pool.swap.inBaseQty = isBuy;
//   pool.swap.qty = ENTRY_AMOUNT;

//   const { finalPrice } = await calcImpact(
//     env,
//     ENTRY,
//     NEXT,
//     POOL_INDEX,
//     pool.swap.isBuy,
//     pool.swap.inBaseQty,
//     ENTRY_AMOUNT,
//   );

//   pool.swap.limitPrice = Decimal.fromBigNumberString(finalPrice)
//     .mul(isBuy ? 1 + SLIPPDAGE : 1 - SLIPPDAGE)
//     .toBigNumber();
//   // @dev https://github.com/CrocSwap/CrocSwap-protocol/blob/8a273515be92dd4e28e4c51a86097e8d35bc48ad/contracts/libraries/Chaining.sol#L28
//   pool.swap.rollType = 0;

//   console.log('price', pool.swap.limitPrice.toString());

//   pool.chain.rollExit = true;
//   // pool.chain.rollType = 0;

//   console.log('ORDER: ', order);

//   const bytes = order.encodeBytes();

//   let value = BigNumber.from(0);
//   // if useSurplus is enabled, we can send higher value than needed - it will be refunded.
//   if (ENTRY === ETH_TOKEN && isBuy) {
//     value = ENTRY_AMOUNT;
//   }

//   const tx = await (
//     await env.context
//   ).dex?.userCmd(PATH, bytes, { gasLimit: 6_000_000, value });
//   console.log({ tx });

//   const result = await tx?.wait();

//   console.log(result.status ? true : false, result);

//   return result;
// };

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

const testAllowance = async (
  owner: string,
  token: CrocTokenView,
  amount: BigNumber,
) => {
  const allowance = await token.allowance(owner);

  if (allowance.lt(amount)) {
    console.log(
      'Need to approve: ' + allowance.toString() + ' < ' + amount.toString(),
    );
    const approval = await token.approve();
    console.log('approval', approval);
    await approval?.wait();
  } else {
    console.log(
      'Already approved: ' + allowance.toString() + ' >= ' + amount.toString(),
    );
  }
};
