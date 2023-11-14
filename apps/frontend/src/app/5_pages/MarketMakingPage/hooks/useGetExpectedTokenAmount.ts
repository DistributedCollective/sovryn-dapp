import { useEffect, useMemo, useState, useCallback } from 'react';

import { Contract } from 'ethers';

import { SupportedTokens, getTokenContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../config/chains';

import { asyncCall } from '../../../../store/rxjs/provider-cache';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const useGetExpectedTokenAmount = (
  pool: AmmLiquidityPool,
  amount: Decimal,
) => {
  const [balanceA, setBalanceA] = useState('0');
  const [balanceB, setBalanceB] = useState('0');

  const expectedTokenAmount = useMemo(
    () => amount.mul(balanceB).div(balanceA).toNumber().toFixed(0),
    [balanceA, balanceB, amount],
  );

  const fetchBalance = useCallback(async () => {
    const [loanTokenContract, sovTokenContract, wrbtcContract] =
      await Promise.all([
        getTokenContract(pool.assetA, defaultChainId),
        getTokenContract(SupportedTokens.sov, defaultChainId),
        getTokenContract(SupportedTokens.wrbtc, defaultChainId),
      ]);

    const contractA = new Contract(
      loanTokenContract.address,
      sovTokenContract.abi,
      getProvider(defaultChainId),
    );
    const contractB = new Contract(
      wrbtcContract.address,
      sovTokenContract.abi,
      getProvider(defaultChainId),
    );

    const [balanceOfA, balanceOfB] = await Promise.all([
      asyncCall(
        `loanToken/${loanTokenContract.address}/balanceOf/${pool.converter}`,
        () => contractA.balanceOf(pool.converter),
      ),
      asyncCall(
        `loanToken/${wrbtcContract.address}/balanceOf/${pool.converter}`,
        () => contractB.balanceOf(pool.converter),
      ),
    ]);

    setBalanceA(balanceOfA.toString());
    setBalanceB(balanceOfB.toString());
  }, [pool]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    amount: expectedTokenAmount,
  };
};
