import { CrocEnv, MAX_SQRT_PRICE, MIN_SQRT_PRICE } from '@sovryn/ambient-sdk';

import { OrderDirective } from '@sovryn/ambient-sdk/src/encoding/longform';
import { ETH_TOKEN, USDC_TOKEN, WBTC_TOKEN } from './fork-constants';
import { BigNumber } from 'ethers';
import { Decimal } from '@sovryn/utils';
import { CrocTokenView } from '@sovryn/ambient-sdk/dist/tokens';
import { parseUnits } from 'ethers/lib/utils';

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
export const multiSwap = async (env: CrocEnv, signer: string) => {
  const buy = false; // true = use ethereum, false = use token
  const useSurplus = false;

  const TOKEN = buy ? ENTRY : NEXT;

  const ENTRY_AMOUNT = await env.token(TOKEN).normQty(buy ? 0.1 : 15);

  console.log({ ENTRY_AMOUNT: ENTRY_AMOUNT.toString() });

  await testAllowance(signer, env.tokens.materialize(ENTRY), ENTRY_AMOUNT);

  const POOL_INDEX = (await env.context).chain.poolIndex;
  const PATH = (await env.context).chain.proxyPaths.long;

  // entry
  const order = new OrderDirective(ENTRY);
  order.open.useSurplus = useSurplus;

  // HOP 1:
  const hop = order.appendHop(NEXT);
  hop.settlement.useSurplus = useSurplus;

  const pool = order.appendPool(POOL_INDEX);

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

  console.log('ORDER: ', order);

  const bytes = order.encodeBytes();

  let value = BigNumber.from(0);
  // if useSurplus is enabled, we can send higher value than needed - it will be refunded.
  if (ENTRY === ETH_TOKEN && buy) {
    value = ENTRY_AMOUNT;
  }

  const tx = await (
    await env.context
  ).dex?.userCmd(PATH, bytes, { gasLimit: 6_000_000, value });
  console.log({ tx });

  const result = await tx?.wait();

  console.log(result.status ? true : false, result);

  return result;
};

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
    console.log('Need to approve');
    const approval = await token.approve();
    console.log('approval', approval);
    await approval?.wait();
  } else {
    console.log(
      'Already approved: ' + allowance.toString() + ' >= ' + amount.toString(),
    );
  }
};
