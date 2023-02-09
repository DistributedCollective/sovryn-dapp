import React, { useEffect, FC, useState, useMemo, useCallback } from 'react';

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
import { useLoaderData } from 'react-router-dom';

import { ZeroPageLoaderData } from '../../5_pages/ZeroPage/loader';
import { useAccount } from '../../../hooks/useAccount';
import { useGetChartOptions } from './hooks/useGetChartOptions';
import { useGetLowestTroves } from './hooks/useGetLowestTroves';
import { useGetRBTCPrice } from './hooks/useGetRBTCPrice';
import { useGetTroves } from './hooks/useGetTroves';
import { useGetTrovesPositions } from './hooks/useGetTrovesPositions';
import { useGetUserOpenTrove } from './hooks/useGetUserOpenTrove';
import {
  ChartBarData,
  ChartDataStructure,
  ChartSortingType,
  TroveData,
  TrovesFilterType,
} from './types';
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
  const [data, setData] = useState<ChartDataStructure>([]);
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const { price } = useGetRBTCPrice();
  const [userCollateralRatio, setUserCollateralRatio] = useState('');
  const [redemptionBuffer, setRedemptionBuffer] = useState(0);
  const [userTrovesBelowCount, setUserTrovesBelowCount] = useState(0);
  const { liquity } = useLoaderData() as ZeroPageLoaderData;
  const [userDebtAmount, setUserDebtAmount] = useState('0');
  const [userCollateralAmount, setUserCollateralAmount] = useState('0');

  const { data: userOpenTrove, loading: loadingUserOpenTrove } =
    useGetUserOpenTrove();

  const { data: lowestTroves, loading: loadingLowestTroves } =
    useGetLowestTroves(userCollateralRatio);

  const hasUserOpenTrove = useMemo(() => {
    if (account) {
      return userOpenTrove?.trove?.changes[0]?.trove.status === 'open';
    }
    return false;
  }, [userOpenTrove, account]);

  const options = useGetChartOptions(
    userCollateralRatio,
    redemptionBuffer,
    activeBar,
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

  const getTroves = useCallback(() => {
    if (account && liquity) {
      liquity.getTrove(account).then(trove => {
        setUserDebtAmount(trove.debt.toString());
        setUserCollateralAmount(trove.collateral.toString());
      });
    }
  }, [account, liquity]);

  useEffect(() => {
    if (account && liquity) {
      getTroves();
    }
  }, [account, liquity, getTroves]);

  const { data: userOpenTroveAbove, loading: loadingUserOpenTroveAbove } =
    useGetTrovesPositions(userCollateralRatio, TrovesFilterType.above);

  const { data: userOpenTroveBelow, loading: loadingUserOpenTroveBelow } =
    useGetTrovesPositions(userCollateralRatio, TrovesFilterType.below);

  const { data: troves, loading: loadingTroves } = useGetTroves();

  const datasets: ChartData<'bar', ChartDataStructure> = useMemo(() => {
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
              const { address } = bar.raw as ChartBarData;
              return activeBar &&
                bar.parsed.y === activeBar &&
                address === account
                ? chartConfig.activeColor
                : chartConfig.defaultColor;
            } else {
              return chartConfig.defaultColor;
            }
          },
        },
      ],
    };
  }, [data, activeBar, account]);

  useEffect(() => {
    if (!loadingUserOpenTrove && userOpenTrove?.trove && !activeBar) {
      const { trove } = userOpenTrove.trove.changes[0];
      setUserCollateralRatio(trove.collateralRatioSortKey?.toString());
    }
    if (activeBar && !userOpenTrove) {
      setActiveBar(null);
      setUserCollateralRatio('');
    }
  }, [userOpenTrove, loadingUserOpenTrove, activeBar]);

  useEffect(() => {
    if (
      userCollateralRatio?.length > 0 &&
      userOpenTroveAbove &&
      userOpenTroveBelow &&
      !loadingUserOpenTroveAbove &&
      !loadingUserOpenTroveBelow &&
      hasUserOpenTrove
    ) {
      const { transaction, trove } = userOpenTrove.trove.changes[0];
      const userTrove = [
        {
          id: transaction.sequenceNumber.toString(),
          sequenceNumber: trove.collateralRatioSortKey.toString(),
          address: trove.id,
          tx: transaction.id,
          collateralAmount: userCollateralAmount,
          debtAmount: userDebtAmount,
          collateralRatio: calculateCollateralRatio(
            userCollateralAmount,
            userDebtAmount,
            price,
          ),
        },
      ];

      const trovesDataAbove = userOpenTroveAbove.troves.map(
        ({ changes }: TroveData) => ({
          id: changes[0].sequenceNumber.toString(),
          sequenceNumber: changes[0].trove.collateralRatioSortKey.toString(),
          address: changes[0].trove.id,
          tx: changes[0].transaction.id,
          collateralAmount: changes[0].trove.collateral,
          debtAmount: changes[0].trove.debt,
          collateralRatio: calculateCollateralRatio(
            changes[0].trove.collateral.toString(),
            changes[0].trove.debt,
            price,
          ),
        }),
      );

      const trovesDataBelow = userOpenTroveBelow.troves.map(
        ({ changes }: TroveData) => ({
          id: changes[0].sequenceNumber.toString(),
          sequenceNumber: changes[0].trove.collateralRatioSortKey.toString(),
          address: changes[0].trove.id,
          tx: changes[0].transaction.id,
          collateralAmount: changes[0].trove.collateral,
          debtAmount: changes[0].trove.debt,
          collateralRatio: calculateCollateralRatio(
            changes[0].trove.collateral.toString(),
            changes[0].trove.debt,
            price,
          ),
        }),
      );

      setData(sortData([...trovesDataBelow, ...userTrove, ...trovesDataAbove]));

      if (lowestTroves) {
        setUserTrovesBelowCount(
          lowestTroves.troves.length - trovesDataAbove.length,
        );
      }

      setActiveBar(
        calculateCollateralRatio(userCollateralAmount, userDebtAmount, price),
      );
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
    userCollateralAmount,
    userDebtAmount,
    activeBar,
  ]);

  useEffect(() => {
    if (
      !loadingTroves &&
      troves &&
      !loadingUserOpenTrove &&
      !hasUserOpenTrove
    ) {
      const trovesData = troves.troves.map(({ changes }: TroveData) => ({
        id: changes[0].sequenceNumber.toString(),
        sequenceNumber: changes[0].trove.collateralRatioSortKey.toString(),
        address: changes[0].trove.id,
        tx: changes[0].transaction.id,
        collateralAmount: changes[0].trove.collateral,
        debtAmount: changes[0].trove.debt,
        collateralRatio: calculateCollateralRatio(
          changes[0].trove.collateral.toString(),
          changes[0].trove.debt,
          price,
        ),
      }));
      setUserTrovesBelowCount(0);
      setData(sortData([...trovesData]));
    }
  }, [price, troves, loadingTroves, hasUserOpenTrove, loadingUserOpenTrove]);
  return <Bar className="max-w-full" options={options} data={datasets} />;
};
