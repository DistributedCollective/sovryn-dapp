import React, { useCallback, useEffect, useRef } from 'react';

import { constants } from 'ethers';

import { CrocEnv } from '@sovryn/ambient-sdk';
import { getProvider } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { useAccount } from '../../../hooks/useAccount';

const TBTC = constants.AddressZero;
const SOV = '0x5a42EF62CE3f49888284a604833466A94fd9fc36';
const USDC = '0x27c3321E40f039d10D5FF831F528C9CEAE601B1d';
// const WBTC = '0x2868d708e442A6a940670d26100036d426F1e16b';
// const USDCc = '0x4F245e278BEC589bAacF36Ba688B412D51874457';

export const BobAmmPage: React.FC = () => {
  const croc = useRef<CrocEnv>();
  const { signer } = useAccount();

  useEffect(() => {
    console.log('signer', signer);
    if (!signer) return;
    croc.current = new CrocEnv(getProvider(BOB_CHAIN_ID), signer);
    console.log('corc', croc.current);
  }, [signer]);

  const handlePoolInit = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const tokenA = croc.current.tokens.materialize(TBTC);
    const tokenB = croc.current.tokens.materialize(USDC);

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

    const tokenA = croc.current.tokens.materialize(TBTC);
    const tokenB = croc.current.tokens.materialize(USDC);

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
    }

    // const tx = await createRangePositionTx({
    //   crocEnv: croc.current,
    //   isAmbient: true,
    //   slippageTolerancePercentage: 0.5,
    //   tokenA: {
    //     address: tokenA.tokenAddr,
    //     qty: 0.1,
    //     isWithdrawFromDexChecked: false,
    //   },
    //   tokenB: {
    //     address: tokenB.tokenAddr,
    //     qty: 100,
    //     isWithdrawFromDexChecked: false,
    //   },
    //   isTokenAPrimaryRange: true,
    //   tick: { low: 1, high: 80000 },
    // });

    // console.log('tx', tx);
    // console.log('tx', tx?.hash);
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

  return (
    <div className="container">
      <NetworkBanner requiredChainId={BOB_CHAIN_ID} />
      <p>Test...</p>
      <ol>
        <li>
          <button onClick={handlePoolInit}>Initialize pool BTC/USDC</button>
        </li>
        <li>
          <button onClick={handleDeposit}>Deposit to BTC/USDC</button>
        </li>
        <li>
          <button onClick={handleSwap}>Swap USDC/USDCc</button>
        </li>
      </ol>
    </div>
  );
};
