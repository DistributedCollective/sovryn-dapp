import { CrocEnv } from '@sovryn/ambient-sdk';
import { BOB_CHAIN_ID } from '../../../config/chains';
import { findAsset } from '../../../utils/asset';

import { OrderDirective } from '@sovryn/ambient-sdk/src/encoding/longform';
import { parseEther } from 'ethers/lib/utils';

export const ETH = findAsset('ETH', BOB_CHAIN_ID).address;
export const SOV = findAsset('SOV', BOB_CHAIN_ID).address;
export const GLD = findAsset('GLD', BOB_CHAIN_ID).address;

const POOL_INDEX = 3600;
const SLIPPDAGE = 0.1;

// Reference
// https://github.com/CrocSwap/sdk/blob/main/src/recipes/reposition.ts
// https://github.com/DistributedCollective/Ambient-DEX/blob/feat/deployment-init/test/FacadePool.ts#L606
// https://github.com/CrocSwap/ambient-ts-app/blob/aa39b19b2c6e1b86c28d37ffa3a74f5031adadf0/src/pages/Trade/Reposition/Reposition.tsx#L135
// https://github.com/CrocSwap/CrocSwap-protocol/blob/8a273515be92dd4e28e4c51a86097e8d35bc48ad/test/TestEncoding.ts#L8

// SOV -> GLD
export const multiSwap = async (env: CrocEnv) => {
  // entry
  const directive = new OrderDirective(SOV);

  // SOV->ETH
  directive.appendHop(ETH);

  const SOV_ETH = getPool(env, SOV, ETH);
  const price = await SOV_ETH.spotPrice();

  const pool1 = directive.appendPool(POOL_INDEX);
  // pool1.chain.swapDefer = true;
  // pool1.swap.rollType = 4;
  pool1.swap.isBuy = false;
  pool1.swap.qty = parseEther('0.000001');

  const priceMult = 1 - SLIPPDAGE; // or 1 - SLIPPDAGE

  pool1.swap.limitPrice = await SOV_ETH.baseToken.normQty(price * priceMult);
  // pool1.swap.limitPrice = encodeCrocPrice(price * priceMult);

  // // ETH->GLD
  // directive.appendHop(GLD);
  // directive.appendPool(3600);

  const bytes = directive.encodeBytes();

  return (await env.context).dex?.userCmd(4, bytes, { gasLimit: 1_000_000 });
};

const getPool = (env: CrocEnv, base: string, quote: string) =>
  env.pool(base, quote);
