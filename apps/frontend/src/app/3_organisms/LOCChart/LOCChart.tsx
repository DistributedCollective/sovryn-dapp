import React, { useEffect, FC, useState, useMemo } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartData,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { useAccount } from '../../../hooks/useAccount';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { fromWei, formatValue } from '../../../utils/math';
import { useGetChartOptions } from './hooks/useGetChartOptions';
import { useGetGlobalsEntity } from './hooks/useGetGlobalsEntity';
import { useGetLowestTroves } from './hooks/useGetLowestTroves';
import { useGetRBTCPrice } from './hooks/useGetRBTCPrice';
import { useGetTroves } from './hooks/useGetTroves';
import { useGetTrovesPositions } from './hooks/useGetTrovesPositions';
import { useGetUserOpenTrove } from './hooks/useGetUserOpenTrove';
import { ChartSortingType, TroveData, TrovesFilterType } from './types';
import {
  calculateCollateralRatio,
  calculateRedemptionBuffer,
  chartConfig,
  sortData,
} from './utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

/**
 * Description: This component is responsible for displaying the chart
 * * Config: Styles for chart are in chartConfig variable
 * * Data: Troves data with open status comes from the useGetTroves hook
 * * Data: User Open Trove data comes from the useGetUserOpenTrove hook
 * * Data: RBTC Price data comes from the useGetRBTCPrice hook
 * * Troves sorting: Troves are sorted by collateral ratio in ascending order
 *
 * Process of getting data:
 * 1. Getting User Open Trove data
 * 2. Setting activeBar for chart (for highlighting User Open Trove)
 * 3. Getting 20 first troves with open status if user not logged in,
 *    otherwise getting 10 above and 10 below users LOC
 * 4. Calculating collateral ratio for each trove
 * 5. Sorting all troves by collateralRatio in ascending order
 * 6. Setting data for chart
 *
 * @returns Chart component with data
 */

export const LOCChart: FC = () => {
  const { account } = useAccount();
  const [data, setData] = useState<TroveData[]>([]);
  const { price } = useGetRBTCPrice();
  const [activeBar, setActiveBar] = useState(false);
  const [userCollateralRatio, setUserCollateralRatio] = useState('');
  const [redemptionBuffer, setRedemptionBuffer] = useState(0);
  const [userTrovesBelowCount, setUserTrovesBelowCount] = useState(0);
  const { value: block } = useBlockNumber();

  const {
    data: userOpenTrove,
    loading: loadingUserOpenTrove,
    refetch: refetchOpenTrove,
  } = useGetUserOpenTrove();

  const {
    data: lowestTroves,
    loading: loadingLowestTroves,
    refetch: refetchLowestTroves,
  } = useGetLowestTroves(userCollateralRatio);

  const { data: globalsEntity } = useGetGlobalsEntity();

  const hasUserOpenTrove = useMemo(() => {
    if (account) {
      return userOpenTrove?.trove?.status === 'open';
    }
    return false;
  }, [userOpenTrove, account]);

  const options = useGetChartOptions(
    activeBar,
    redemptionBuffer,
    userTrovesBelowCount,
  );

  useEffect(() => {
    if (!loadingLowestTroves) {
      const redemptionBuffer = lowestTroves?.troves.reduce(
        (acc, curr) =>
          acc +
          calculateRedemptionBuffer(
            Number(curr.debt),
            Number(curr.collateral),
            Number(userCollateralRatio),
            price,
          ),
        0,
      );
      setRedemptionBuffer(redemptionBuffer);
    }
  }, [lowestTroves, loadingLowestTroves, userCollateralRatio, price]);

  const {
    data: userOpenTroveAbove,
    loading: loadingUserOpenTroveAbove,
    refetch: refetchUserOpenTroveAbove,
  } = useGetTrovesPositions(userCollateralRatio, TrovesFilterType.above);

  const {
    data: userOpenTroveBelow,
    loading: loadingUserOpenTroveBelow,
    refetch: refetchUserOpenTroveBelow,
  } = useGetTrovesPositions(userCollateralRatio, TrovesFilterType.below);

  const {
    data: troves,
    loading: loadingTroves,
    refetch: refetchTroves,
  } = useGetTroves();

  useEffect(() => {
    refetchOpenTrove();
    refetchLowestTroves();
    refetchUserOpenTroveAbove();
    refetchUserOpenTroveBelow();
    refetchTroves();
  }, [
    refetchTroves,
    block,
    refetchOpenTrove,
    refetchLowestTroves,
    refetchUserOpenTroveAbove,
    refetchUserOpenTroveBelow,
  ]);

  const datasets: ChartData<'bar', TroveData[]> = useMemo(() => {
    return {
      datasets: [
        {
          data: data,
          parsing: {
            xAxisKey: ChartSortingType.id,
            yAxisKey: ChartSortingType.collateralRatio,
          },
          backgroundColor: bar => {
            if (bar.raw) {
              const { id } = bar.raw as TroveData;
              return id === account
                ? chartConfig.activeColor
                : chartConfig.defaultColor;
            } else {
              return chartConfig.defaultColor;
            }
          },
        },
      ],
    };
  }, [data, account]);

  useEffect(() => {
    if (!loadingUserOpenTrove && userOpenTrove?.trove) {
      const { trove } = userOpenTrove;
      setUserCollateralRatio(trove.collateralRatioSortKey);
      setActiveBar(true);
    }
    if (!userOpenTrove) {
      setUserCollateralRatio('');
    }
  }, [userOpenTrove, loadingUserOpenTrove]);

  useEffect(() => {
    if (
      userCollateralRatio?.length > 0 &&
      userOpenTroveAbove &&
      userOpenTroveBelow &&
      !loadingUserOpenTroveAbove &&
      !loadingUserOpenTroveBelow &&
      hasUserOpenTrove
    ) {
      const { trove } = userOpenTrove;
      const totalDebt = globalsEntity?.globals[0].rawTotalRedistributedDebt;
      const snapshotOfTotalDebt = trove.rawSnapshotOfTotalRedistributedDebt;
      const totalCollateral =
        globalsEntity?.globals[0].rawTotalRedistributedCollateral;
      const snapshotOfTotalCollateral =
        trove.rawSnapshotOfTotalRedistributedCollateral;
      const stake = trove.rawStake;

      const debtAmount = formatValue(
        (Number(fromWei(totalDebt)) - Number(fromWei(snapshotOfTotalDebt))) *
          Number(fromWei(stake)),
        8,
      );
      const collateralAmount = formatValue(
        (Number(fromWei(totalCollateral)) -
          Number(fromWei(snapshotOfTotalCollateral))) *
          Number(fromWei(stake)),
        8,
      );

      const userTrove = [
        {
          id: trove.id,
          collateralAmount: Number(trove.collateral) + Number(collateralAmount),
          debtAmount: Number(trove.debt) + Number(debtAmount),
          collateralRatioSortKey: trove.collateralRatioSortKey,
          collateralRatio: calculateCollateralRatio(
            Number(trove.collateral) + Number(collateralAmount),
            Number(trove.debt) + Number(debtAmount),
            price,
          ),
        },
      ];

      const trovesDataAbove = userOpenTroveAbove.troves.map(
        (trove: TroveData) => ({
          id: trove.id,
          collateralAmount: Number(trove.collateral) + Number(collateralAmount),
          debtAmount: Number(trove.debt) + Number(debtAmount),
          collateralRatioSortKey: trove.collateralRatioSortKey,
          collateralRatio: calculateCollateralRatio(
            Number(trove.collateral) + Number(collateralAmount),
            Number(trove.debt) + Number(debtAmount),
            price,
          ),
        }),
      );

      const trovesDataBelow = userOpenTroveBelow.troves.map(
        (trove: TroveData) => ({
          id: trove.id,
          collateralAmount: Number(trove.collateral) + Number(collateralAmount),
          debtAmount: Number(trove.debt) + Number(debtAmount),
          collateralRatioSortKey: trove.collateralRatioSortKey,
          collateralRatio: calculateCollateralRatio(
            Number(trove.collateral) + Number(collateralAmount),
            Number(trove.debt) + Number(debtAmount),
            price,
          ),
        }),
      );

      setData([...trovesDataBelow, ...userTrove, ...trovesDataAbove]);
      if (lowestTroves) {
        setUserTrovesBelowCount(
          lowestTroves.troves.length - trovesDataBelow.length,
        );
      }

      setActiveBar(true);
    }
  }, [
    userOpenTrove,
    lowestTroves,
    hasUserOpenTrove,
    userCollateralRatio,
    userOpenTroveAbove,
    userOpenTroveBelow,
    loadingUserOpenTrove,
    loadingUserOpenTroveAbove,
    loadingUserOpenTroveBelow,
    price,
    globalsEntity,
  ]);

  useEffect(() => {
    if (
      !loadingTroves &&
      troves &&
      !loadingUserOpenTrove &&
      !hasUserOpenTrove
    ) {
      const trovesData = troves.troves.map((trove: TroveData) => ({
        id: trove.id,
        collateralAmount: trove.collateral,
        debtAmount: trove.debt,
        collateralRatioSortKey: trove.collateralRatioSortKey,
        collateralRatioSortKey_legacy: trove.collateralRatioSortKey_legacy,
        collateralRatio: calculateCollateralRatio(
          trove.collateral,
          Number(trove.debt),
          price,
        ),
      }));
      setUserTrovesBelowCount(0);
      setData(sortData([...trovesData]));
      setActiveBar(false);
    }
  }, [price, troves, loadingTroves, hasUserOpenTrove, loadingUserOpenTrove]);
  return <Bar className="max-w-full" options={options} data={datasets} />;
};
