import React, { useCallback, useEffect, useRef } from 'react';

import { CrocEnv } from '@sovryn/ambient-sdk';
import { getProvider } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { useAccount } from '../../../hooks/useAccount';
import { findAsset } from '../../../utils/asset';
import { createRangePositionTx } from './ambient-utils';
import { multiSwap } from './testing-swap';
import { ChainIds } from '@sovryn/ethers-provider';
import { ETH_TOKEN, OKB_TOKEN, USDC_TOKEN, WBTC_TOKEN } from './fork-constants';
import { parseUnits } from 'ethers/lib/utils';
import { CrocTokenView } from '@sovryn/ambient-sdk/dist/tokens';

// const CHAIN_ID = BOB_CHAIN_ID;
const CHAIN_ID = ChainIds.SEPOLIA;
// const USDC_TOKEN = findAsset('GLD', BOB_CHAIN_ID)?.address;

const testAllowance = async (
  owner: string,
  token: CrocTokenView,
  amount: number,
) => {
  const allowance = await token.allowance(owner);
  const decimals = await token.decimals;

  const needAllowance = parseUnits(
    (amount + 0.00001).toFixed(decimals),
    decimals,
  );

  if (allowance.lt(needAllowance)) {
    console.log('Need to approve');
    const approval = await token.approve();
    console.log('approval', approval);
    await approval?.wait();
  }
};

export const BobAmmPage: React.FC = () => {
  const croc = useRef<CrocEnv>();
  const { signer, account } = useAccount();

  useEffect(() => {
    if (!signer) return;
    croc.current = new CrocEnv(getProvider(CHAIN_ID), signer);
  }, [signer]);

  const handlePoolInit = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const tokenA = croc.current.tokens.materialize(ETH_TOKEN);
    const tokenB = croc.current.tokens.materialize(OKB_TOKEN);

    // await tokenA.approveBypassRouter();
    // await tokenA.approveRouter();

    const pool = croc.current.pool(tokenA.tokenAddr, tokenB.tokenAddr);
    console.log({ pool });

    const init = await pool.isInit();
    console.log('is init', init);

    const price = await pool.displayPrice();
    console.log('display price', price);

    if (!init) {
      console.log('need to init');

      await testAllowance(account, tokenA, 1);
      await testAllowance(account, tokenB, 1);

      const tx = await pool.initPool(100);
      console.log('init pool price: ', tx);
    } else {
      alert('Pool already initialized');
    }
  }, [account]);

  const handleDeposit = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const tokenA = croc.current.tokens.materialize(ETH_TOKEN);
    const tokenB = croc.current.tokens.materialize(WBTC_TOKEN);

    const pool = croc.current.pool(tokenA.tokenAddr, tokenB.tokenAddr);
    console.log({ pool });

    const init = await pool.isInit();

    if (!init) {
      alert('Pool not initialized');
      return;
    }

    // const approval = await tokenB.approve();
    // approval?.wait();
    // console.log('approval', approval);

    const price = await pool.displayPrice();

    console.log('display price', price);

    const TOKEN_A_AMOUNT = 200; // 0.0001
    const TOKEN_B_AMOUNT = price * TOKEN_A_AMOUNT;

    console.log({ TOKEN_A_AMOUNT, TOKEN_B_AMOUNT });

    await testAllowance(account, tokenA, TOKEN_A_AMOUNT);
    await testAllowance(account, tokenB, TOKEN_B_AMOUNT);

    const tx = await createRangePositionTx({
      crocEnv: croc.current,
      isAmbient: true,
      slippageTolerancePercentage: 3,
      tokenA: {
        address: tokenA.tokenAddr,
        qty: TOKEN_A_AMOUNT,
        isWithdrawFromDexChecked: false,
      },
      tokenB: {
        address: tokenB.tokenAddr,
        qty: TOKEN_B_AMOUNT,
        isWithdrawFromDexChecked: false,
      },
      isTokenAPrimaryRange: true,
      tick: { low: 2552, high: 3100 },
    });

    console.log('tx', tx);
    console.log('tx', tx?.hash);

    const receipt = await tx?.wait();
    console.log('receipt', receipt);
  }, [account]);

  const handleSwap = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const tokenA = croc.current.tokens.materialize(ETH_TOKEN);
    const tokenB = croc.current.tokens.materialize(USDC_TOKEN);

    const pool = croc.current.pool(tokenA.tokenAddr, tokenB.tokenAddr);

    const price = await pool.displayPrice();
    console.log('price', price);

    const plan = croc.current
      .sell(tokenA.tokenAddr, 0.01)
      .for(tokenB.tokenAddr);

    console.log('plan', plan);

    const impact = await plan.impact;
    console.log({ impact });

    const slippage = plan.priceSlippage;
    console.log({ slippage });

    const tx = await plan.swap();
    console.log({ tx });

    const result = await tx.wait();
    console.log({ result });
  }, []);

  const handleMultihop = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const query = (await croc.current.context).query;

    console.log({ query });

    await multiSwap(croc.current);

    // const tokenA = croc.current.tokens.materialize(SOV);
    // const tokenB = croc.current.tokens.materialize(USDT);

    // const plan = croc.current
    //   .sell(tokenA.tokenAddr, 0.001)
    //   .for(tokenB.tokenAddr)
    //   .useBypass();

    // console.log('plan', plan);

    // todo...

    // const impact = await plan.impact;
    // console.log({ impact });

    // const slippage = plan.priceSlippage;
    // console.log({ slippage });

    // const tx = await plan.swap();
    // console.log({ tx });
  }, []);

  return (
    <div className="container">
      <p>Test...</p>
      <ol>
        <li>
          <button onClick={handlePoolInit}>Initialize pool</button>
        </li>
        <li>
          <button onClick={handleDeposit}>Deposit to pool</button>
        </li>
        <li>
          <button onClick={handleSwap}>Swap</button>
        </li>
        <li>
          <button onClick={handleMultihop}>Swap multihop</button>
        </li>
      </ol>
    </div>
  );
};
