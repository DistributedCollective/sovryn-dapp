import { useCallback, useEffect, useState } from 'react';

import { Contract } from 'ethers';

import { SupportedTokens, getTokenContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { defaultRskChainId } from '../../../../../../config/chains';

import { asyncCall } from '../../../../../../store/rxjs/provider-cache';
import { AmmLiquidityPool } from '../../../utils/AmmLiquidityPool';

export const useGetPoolsBalance = (pool: AmmLiquidityPool) => {
  const [poolBalanceA, setPoolBalanceA] = useState(Decimal.ZERO);
  const [poolBalanceB, setPoolBalanceB] = useState(Decimal.ZERO);

  const fetchBalance = useCallback(async () => {
    const [loanTokenContract, sovTokenContract, wrbtcContract] =
      await Promise.all([
        getTokenContract(pool.assetA, defaultRskChainId),
        getTokenContract(SupportedTokens.sov, defaultRskChainId),
        getTokenContract(SupportedTokens.wrbtc, defaultRskChainId),
      ]);

    const contractA = new Contract(
      loanTokenContract.address,
      sovTokenContract.abi,
      getProvider(defaultRskChainId),
    );
    const contractB = new Contract(
      wrbtcContract.address,
      sovTokenContract.abi,
      getProvider(defaultRskChainId),
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
