import React, { useCallback, useEffect, useRef } from 'react';

import { constants } from 'ethers';

import { CrocEnv } from '@sovryn/ambient-sdk';
import { getProvider } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { useAccount } from '../../../hooks/useAccount';
import { COMMON_SYMBOLS, findAsset } from '../../../utils/asset';
import { createRangePositionTx } from './ambient-utils';

const ETH = constants.AddressZero;
const SOV = findAsset(COMMON_SYMBOLS.SOV, BOB_CHAIN_ID).address;
const USDC = findAsset('USDC', BOB_CHAIN_ID).address;

export const BobAmmPage: React.FC = () => {
  const croc = useRef<CrocEnv>();
  const { signer } = useAccount();

  useEffect(() => {
    if (!signer) return;
    croc.current = new CrocEnv(getProvider(BOB_CHAIN_ID), signer);
  }, [signer]);

  const handlePoolInit = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const tokenA = croc.current.tokens.materialize(ETH);
    const tokenB = croc.current.tokens.materialize(SOV);

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
      const tx = await pool.initPool(70_000);
      console.log('init pool price: ', tx);
    } else {
      alert('Pool already initialized');
    }
  }, []);

  const handleDeposit = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const tokenA = croc.current.tokens.materialize(ETH);
    const tokenB = croc.current.tokens.materialize(SOV);

    const pool = croc.current.pool(tokenA.tokenAddr, tokenB.tokenAddr);
    console.log({ pool });

    const init = await pool.isInit();
    console.log('is init', init);

    const price = await pool.displayPrice();
    console.log('display price', price);

    const tx = await createRangePositionTx({
      crocEnv: croc.current,
      isAmbient: true,
      slippageTolerancePercentage: 0.5,
      tokenA: {
        address: tokenA.tokenAddr,
        qty: 0.1,
        isWithdrawFromDexChecked: false,
      },
      tokenB: {
        address: tokenB.tokenAddr,
        qty: 100,
        isWithdrawFromDexChecked: false,
      },
      isTokenAPrimaryRange: true,
      tick: { low: 1, high: 80000 },
    });

    console.log('tx', tx);
    console.log('tx', tx?.hash);
  }, []);

  const handleSwap = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const tokenA = croc.current.tokens.materialize(SOV);
    const tokenB = croc.current.tokens.materialize(USDC);

    const plan = croc.current
      .sell(tokenA.tokenAddr, 0.001)
      .for(tokenB.tokenAddr);

    console.log('plan', plan);

    const impact = await plan.impact;
    console.log({ impact });

    const slippage = plan.priceSlippage;
    console.log({ slippage });

    const tx = await plan.swap();
    console.log({ tx });
  }, []);

  const handleMultihop = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const tokenA = croc.current.tokens.materialize(SOV);
    const tokenB = croc.current.tokens.materialize(USDC);

    const plan = croc.current
      .sell(tokenA.tokenAddr, 0.001)
      .for(tokenB.tokenAddr)
      .useBypass();

    console.log('plan', plan);

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
      <NetworkBanner requiredChainId={BOB_CHAIN_ID} />
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
