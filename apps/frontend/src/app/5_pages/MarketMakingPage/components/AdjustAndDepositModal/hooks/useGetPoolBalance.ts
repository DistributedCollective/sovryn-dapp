import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { decimalic } from '../../../../../../utils/math';
import { AmmLiquidityPool } from '../../../utils/AmmLiquidityPool';
import { AdjustType } from '../AdjustAndDepositModal.types';

export const useGetPoolBalance = (
  isAmountZero: boolean,
  adjustType: AdjustType,
  loadingA: boolean,
  pool: AmmLiquidityPool,
  account: string,
) => {
  const [tokenPoolBalance, setTokenPoolBalance] = useState<Decimal>(
    Decimal.ZERO,
  );
  const liquidityMiningProxy = useGetProtocolContract('liquidityMiningProxy');

  useEffect(() => {
    const fetchPoolBalance = async () => {
      if (!liquidityMiningProxy) {
        return;
      }
      try {
        const poolBalance = await liquidityMiningProxy.getUserInfo(
          pool.poolTokenA,
          account,
        );
        if (poolBalance) {
          setTokenPoolBalance(decimalic(poolBalance.amount.toString()));
        }
      } catch (error) {
        console.error('Error fetching pool balance:', error);
      }
    };

    if (!isAmountZero && adjustType === AdjustType.Withdraw && !loadingA) {
      fetchPoolBalance();
    }
  }, [isAmountZero, adjustType, loadingA, pool, account, liquidityMiningProxy]);

  return { tokenPoolBalance };
};
