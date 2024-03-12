import React, { useCallback, useEffect, useRef } from 'react';

import { CrocEnv } from '@sovryn/ambient-sdk';
import { getTokenContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { useAccount } from '../../../hooks/useAccount';

export const BobAmmPage: React.FC = () => {
  const croc = useRef<CrocEnv>();
  const { signer } = useAccount();

  useEffect(() => {
    console.log('signer', signer);
    if (!signer) return;
    croc.current = new CrocEnv(getProvider(BOB_CHAIN_ID), signer);
    console.log('corc', croc.current);
  }, [signer]);

  const handleDeposit = useCallback(async () => {
    if (!croc.current) {
      alert('CrocEnv not initialized');
      return;
    }

    const tokenContractA = await getTokenContract('btc', BOB_CHAIN_ID);
    const tokenContractB = await getTokenContract('usdc', BOB_CHAIN_ID);

    const tokenA = croc.current.tokens.materialize(tokenContractA.address);
    const tokenB = croc.current.tokens.materialize(tokenContractB.address);

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

  return (
    <div className="container">
      <NetworkBanner requiredChainId={BOB_CHAIN_ID} />
      <p>Test...</p>
      <button onClick={handleDeposit}>Deposit BTC/USDC</button>
    </div>
  );
};
