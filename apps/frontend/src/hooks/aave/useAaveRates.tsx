import { useMemo, useState } from 'react';

import { BigNumber, Contract } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useSearchParams } from 'react-router-dom';

import { useAccount } from '../useAccount';
import rateStrategy from './ReserveStrategy-rateStrategyStableOne.json';
import { BIG_NUMBER_PRECISION_TWENTY_SEVEN } from './constants';
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
  //baseStableRateOffset: string;
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
  data: IRatesDataResult | null;
  error: string | null;
  loading: boolean;
} => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { provider } = useAccount();

  // const { provider } = useAccount();
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('asset') || '';
  const { reserves } = useAaveReservesData();
  const reserveAsset = reserves.find(
    r => r.symbol.toLocaleLowerCase() === symbol.toLocaleLowerCase(),
  );
  const interestRateStrategyAddress = reserveAsset?.interestRateStrategyAddress;
  console.log('reserves', reserves);
  console.log('reserveAsset', reserveAsset);
  console.log('interestRateStrategyAddress', interestRateStrategyAddress);

  useMemo(() => {
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
            BIG_NUMBER_PRECISION_TWENTY_SEVEN,
          ).toString(),
          baseVariableBorrowRate: formatUnits(
            reserveAsset.baseVariableBorrowRate,
            BIG_NUMBER_PRECISION_TWENTY_SEVEN,
          ).toString(),
          variableRateSlope1: formatUnits(
            reserveAsset.variableRateSlope1,
            BIG_NUMBER_PRECISION_TWENTY_SEVEN,
          ).toString(),
          variableRateSlope2: formatUnits(
            reserveAsset.variableRateSlope2,
            BIG_NUMBER_PRECISION_TWENTY_SEVEN,
          ).toString(),
          stableRateSlope1: formatUnits(
            reserveAsset.stableRateSlope1,
            BIG_NUMBER_PRECISION_TWENTY_SEVEN,
          ).toString(),
          stableRateSlope2: formatUnits(
            reserveAsset.stableRateSlope2,
            BIG_NUMBER_PRECISION_TWENTY_SEVEN,
          ).toString(),
          baseStableBorrowRate: formatUnits(
            reserveAsset.baseStableBorrowRate,
            BIG_NUMBER_PRECISION_TWENTY_SEVEN,
          ).toString(),
          stableRateExcessOffset: formatUnits(
            stableRateExcessOffset,
            BIG_NUMBER_PRECISION_TWENTY_SEVEN,
          ).toString(),
          optimalStableToTotalDebtRatio: formatUnits(
            optimalStableToTotalDebtRatio,
            BIG_NUMBER_PRECISION_TWENTY_SEVEN,
          ).toString(),
          underlyingAsset: reserveAsset.underlyingAsset.toString(),
          name: reserveAsset.name.toString(),
          symbol: reserveAsset.symbol.toString(),
          decimals: reserveAsset.decimals.toString(),
        };
        setData(ratesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }

      return data;
    };
    fetchData();
  }, [data, interestRateStrategyAddress, provider, reserveAsset]);

  return { data, loading, error };
};
