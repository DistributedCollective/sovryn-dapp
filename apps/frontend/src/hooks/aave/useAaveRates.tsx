import { RAY_DECIMALS } from '@aave/math-utils';

import { useEffect, useState } from 'react';

import { BigNumber, Contract } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useSearchParams } from 'react-router-dom';

import { useAccount } from '../useAccount';
import rateStrategy from './ReserveStrategy-rateStrategyStableOne.json';
import { useAaveReservesData } from './useAaveReservesData';

export interface IRatesDataResult {
  currentUsageRatio: string;
  baseStableBorrowRate: string;
  optimalUsageRatio: string;
  baseVariableBorrowRate: string;
  variableRateSlope1: string;
  variableRateSlope2: string;
  stableRateSlope1: string;
  stableRateSlope2: string;
  stableRateExcessOffset: string;
  optimalStableToTotalDebtRatio: string;
  underlyingAsset: string;
  name: string;
  symbol: string;
  decimals: string;
}

function calculateUtilizationRate(
  totalDebt: string,
  availableLiquidity: string,
): string {
  // Convert inputs to BigNumber
  const _totalDebt: BigNumber = BigNumber.from(totalDebt);
  const _liquidity: BigNumber = BigNumber.from(availableLiquidity);

  return _totalDebt.div(_totalDebt.add(_liquidity)).toString();
}

export const useAaveInterestRatesData = (): {
  rates: IRatesDataResult | null;
  error: string | null;
  loading: boolean;
} => {
  const [rates, setRates] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { provider } = useAccount();

  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('asset') || '';
  const { reserves } = useAaveReservesData();
  const reserveAsset = reserves.find(
    r => r.symbol.toLocaleLowerCase() === symbol.toLocaleLowerCase(),
  );
  const interestRateStrategyAddress = reserveAsset?.interestRateStrategyAddress;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!interestRateStrategyAddress) {
          console.log(
            'Interest Rate Strategy Address not found',
            reserveAsset,
            reserveAsset?.interestRateStrategyAddress,
          );
          setError('Interest Rate Strategy Address not found');
          return;
        }
        const ratesStrategy = new Contract(
          interestRateStrategyAddress as string,
          rateStrategy.abi,
          provider,
        );
        const utilizationRate = calculateUtilizationRate(
          reserveAsset.totalDebt,
          reserveAsset.availableLiquidity,
        );
        console.log('utilizationRate', utilizationRate);

        const [stableRateExcessOffset, optimalStableToTotalDebtRatio] =
          await Promise.all([
            ratesStrategy.getStableRateExcessOffset(),
            ratesStrategy.OPTIMAL_STABLE_TO_TOTAL_DEBT_RATIO(),
          ]);

        const ratesData = {
          currentUsageRatio: formatUnits(utilizationRate, 2).toString(),
          optimalUsageRatio: formatUnits(
            reserveAsset.optimalUsageRatio,
            RAY_DECIMALS,
          ).toString(),
          baseVariableBorrowRate: formatUnits(
            reserveAsset.baseVariableBorrowRate,
            RAY_DECIMALS,
          ).toString(),
          variableRateSlope1: formatUnits(
            reserveAsset.variableRateSlope1,
            RAY_DECIMALS,
          ).toString(),
          variableRateSlope2: formatUnits(
            reserveAsset.variableRateSlope2,
            RAY_DECIMALS,
          ).toString(),
          stableRateSlope1: formatUnits(
            reserveAsset.stableRateSlope1,
            RAY_DECIMALS,
          ).toString(),
          stableRateSlope2: formatUnits(
            reserveAsset.stableRateSlope2,
            RAY_DECIMALS,
          ).toString(),
          baseStableBorrowRate: formatUnits(
            reserveAsset.baseStableBorrowRate,
            RAY_DECIMALS,
          ).toString(),
          stableRateExcessOffset: formatUnits(
            stableRateExcessOffset,
            RAY_DECIMALS,
          ).toString(),
          optimalStableToTotalDebtRatio: formatUnits(
            optimalStableToTotalDebtRatio,
            RAY_DECIMALS,
          ).toString(),
          underlyingAsset: reserveAsset.underlyingAsset.toString(),
          name: reserveAsset.name.toString(),
          symbol: reserveAsset.symbol.toString(),
          decimals: reserveAsset.decimals.toString(),
        };
        setRates(ratesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rates, interestRateStrategyAddress, provider, reserveAsset]);

  return { rates, loading, error };
};
