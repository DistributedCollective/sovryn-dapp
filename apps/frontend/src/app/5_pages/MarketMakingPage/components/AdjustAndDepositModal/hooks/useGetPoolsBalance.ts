import { useCallback, useEffect, useState } from 'react';

import { Contract } from 'ethers';

import { getAssetData } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { asyncCall } from '../../../../../../store/rxjs/provider-cache';
import { COMMON_SYMBOLS } from '../../../../../../utils/asset';
import { AmmLiquidityPool } from '../../../utils/AmmLiquidityPool';

export const useGetPoolsBalance = (pool: AmmLiquidityPool) => {
  const [poolBalanceA, setPoolBalanceA] = useState(Decimal.ZERO);
  const [poolBalanceB, setPoolBalanceB] = useState(Decimal.ZERO);

  const fetchBalance = useCallback(async () => {
    const [loanTokenContract, sovTokenContract, wrbtcContract] =
      await Promise.all([
        getAssetData(pool.assetA, RSK_CHAIN_ID),
        getAssetData(COMMON_SYMBOLS.SOV, RSK_CHAIN_ID),
        getAssetData(COMMON_SYMBOLS.WBTC, RSK_CHAIN_ID),
      ]);

    const contractA = new Contract(
      loanTokenContract.address,
      sovTokenContract.abi,
      getProvider(RSK_CHAIN_ID),
    );
    const contractB = new Contract(
      wrbtcContract.address,
      sovTokenContract.abi,
      getProvider(RSK_CHAIN_ID),
    );

    const [balanceOfA, balanceOfB] = await Promise.all([
      asyncCall(
        `loanToken/${loanTokenContract.address}/balanceOf/${pool.converter}`,
        () =>
          contractA.balanceOf(pool.converter).then(Decimal.fromBigNumberString),
      ),
      asyncCall(
        `loanToken/${wrbtcContract.address}/balanceOf/${pool.converter}`,
        () =>
          contractB.balanceOf(pool.converter).then(Decimal.fromBigNumberString),
      ),
    ]);

    setPoolBalanceA(balanceOfA);
    setPoolBalanceB(balanceOfB);
  }, [pool]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    poolBalanceA,
    poolBalanceB,
  };
};
