import { useMemo } from 'react';

import { Decimal } from '@sovryn/utils';

import { useGetPoolsBalance } from '../components/AdjustAndDepositModal/hooks/useGetPoolsBalance';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const useGetExpectedTokenAmount = (
  pool: AmmLiquidityPool,
  amount: Decimal,
): Decimal => {
  const { poolBalanceA, poolBalanceB } = useGetPoolsBalance(pool);

  const expectedTokenAmount: Decimal = useMemo(() => {
    if (!poolBalanceA || !poolBalanceB || !amount) {
      return Decimal.ZERO;
    }
    return amount.mul(poolBalanceB).div(poolBalanceA);
  }, [poolBalanceA, poolBalanceB, amount]);

  return expectedTokenAmount;
};
