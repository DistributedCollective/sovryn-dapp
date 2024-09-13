import { useMemo, useState } from 'react';

import { formatUnits } from 'ethers/lib/utils';

import { Decimal } from '@sovryn/utils';

import { AaveCalculations } from '../../utils/aave/AaveCalculations';
import { RAY_DECIMALS } from '../../utils/math';
import { useAaveReservesData } from './useAaveReservesData';

export interface RatesDataResult {
  currentUsageRatio: Decimal;
  optimalUsageRatio: Decimal;
  baseVariableBorrowRate: Decimal;
  variableRateSlope1: Decimal;
  variableRateSlope2: Decimal;
  underlyingAsset: string;
  name: string;
  symbol: string;
  decimals: number;
}

export const useAaveInterestRatesData = (
  symbol: string,
): {
  data: RatesDataResult | null;
  error: string | null;
} => {
  const [data, setData] = useState<RatesDataResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { reserves } = useAaveReservesData();
  useMemo(() => {
    const reserve = reserves.find(
      r => r.symbol.toLocaleLowerCase() === symbol.toLocaleLowerCase(),
    );
    if (!reserve) {
      return;
    }
    try {
      const utilizationRate = AaveCalculations.calculateUtilizationRate(
        reserve.decimals,
        reserve.totalDebt,
        reserve.availableLiquidity,
      );
      setData({
        currentUsageRatio: utilizationRate,
        optimalUsageRatio: Decimal.from(
          formatUnits(reserve.optimalUsageRatio, RAY_DECIMALS),
        ),
        baseVariableBorrowRate: Decimal.from(
          formatUnits(reserve.baseVariableBorrowRate, RAY_DECIMALS),
        ),
        variableRateSlope1: Decimal.from(
          formatUnits(reserve.variableRateSlope1, RAY_DECIMALS),
        ),
        variableRateSlope2: Decimal.from(
          formatUnits(reserve.variableRateSlope2, RAY_DECIMALS),
        ),
        underlyingAsset: reserve.underlyingAsset,
        name: reserve.name,
        symbol: reserve.symbol,
        decimals: reserve.decimals,
      });
    } catch (error) {
      setError(error.message);
    }
  }, [reserves, symbol]);

  return { data, error };
};
