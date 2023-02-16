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
import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { prettyTx } from '@sovryn/ui';

import { useAccount } from '../../../hooks/useAccount';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { translations } from '../../../locales/i18n';
import { Bitcoin } from '../../../utils/constants';
import { formatValue } from '../../../utils/math';
import {
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../ZeroLocForm/constants';
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
  const { t } = useTranslation();
  const { account } = useAccount();
  const [data, setData] = useState<ChartDataStructure>([]);
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const { price } = useGetRBTCPrice();
  const [userCollateralRatio, setUserCollateralRatio] = useState('');
  const [redemptionBuffer, setRedemptionBuffer] = useState(0);

  const { value: block } = useBlockNumber();

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          borderRadius: chartConfig.tooltipBorderRadius,
          yAlign: 'bottom' as const,
          backgroundColor: chartConfig.fontColor,
          padding: chartConfig.tooltipPadding,
          caretSize: chartConfig.caretSize,
          bodyColor: chartConfig.borderColor,
          bodyFont: {
            family: chartConfig.defaultFont,
            weight: chartConfig.weight,
            lineHeight: chartConfig.tooltipLineHeight,
          },
          callbacks: {
            title: () => '',
            label: () => '',
            beforeBody: context => {
              const { collateralAmount, address, debtAmount, collateralRatio } =
                context[0].raw;
              const tooltipContent = [
                prettyTx(address),
                `${t(translations.chart.collateralAmount)}: ${formatValue(
                  Number(collateralAmount),
                  BTC_RENDER_PRECISION,
                )} ${Bitcoin}`,
                `${t(translations.chart.debtAmount)}: ${formatValue(
                  Number(debtAmount),
                  TOKEN_RENDER_PRECISION,
                )} ${SupportedTokens.zusd.toUpperCase()}`,
                `${t(translations.chart.collateralRatio)}: ${formatValue(
                  Number(collateralRatio),
                  0,
                )}%`,
              ];

              if (context[0].raw.sequenceNumber === userCollateralRatio) {
                tooltipContent.push(
                  `${t(translations.chart.redemptionBuffer)}: ${formatValue(
                    redemptionBuffer,
                    TOKEN_RENDER_PRECISION,
                  )} ${SupportedTokens.zusd.toUpperCase()}`,
                );
              }
              return tooltipContent;
            },
          },
        },
        legend: {
          labels: {
            color: chartConfig.fontColor,
            boxWidth: chartConfig.legendBoxWidth,
            generateLabels: () => {
              const labelDefault = {
                text: t(translations.chart.collateralRatio),
                fontColor: chartConfig.fontColor,
                fillStyle: chartConfig.defaultColor,
                lineWidth: chartConfig.legendLineWidth,
              };
              const labelActive = {
                text: t(translations.chart.myCollateralRatio),
                fontColor: chartConfig.fontColor,
                fillStyle: chartConfig.activeColor,
                lineWidth: chartConfig.legendLineWidth,
              };
              return !activeBar ? [labelDefault] : [labelDefault, labelActive];
            },
          },
        },
      },
      scales: {
        x: {
          suggestedMax: chartConfig.maxValue,
          suggestedMin: chartConfig.minValue,
          grid: {
            drawOnChartArea: false,
            drawTicks: true,
            tickColor: chartConfig.defaultColor,
            tickLength: chartConfig.tickLength,
            lineWidth: chartConfig.lineWidth,
            offset: false,
          },
          border: {
            color: chartConfig.defaultColor,
          },
          ticks: {
            callback: value => Number(value + 1).toFixed(0),
            color: chartConfig.fontColor,
            font: {
              family: chartConfig.defaultFont,
              size: chartConfig.fontSize,
              weight: chartConfig.weight,
            },
            padding: chartConfig.tickPadding,
            beginAtZero: true,
          },
        },
        y: {
          gridDashType: 'dash',
          grid: {
            drawOnChartArea: false,
            drawTicks: true,
            tickColor: chartConfig.defaultColor,
            tickLength: chartConfig.tickLength,
            lineWidth: chartConfig.lineWidth,
          },
          border: {
            color: chartConfig.defaultColor,
          },
          ticks: {
            callback: value => Number(value).toFixed(2) + '%',
            color: chartConfig.fontColor,
            font: {
              family: chartConfig.defaultFont,
              size: chartConfig.tickSize,
              weight: chartConfig.weight,
            },
            padding: chartConfig.tickPadding,
            beginAtZero: true,
          },
        },
      },
    };
  }, [t, activeBar, userCollateralRatio, redemptionBuffer]);

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

  const isUserOpenTrove = useMemo(() => {
    if (account) {
      return userOpenTrove?.trove?.changes[0]?.trove.status === 'open';
    }
    return false;
  }, [userOpenTrove, account]);

  useEffect(() => {
    if (!loadingLowestTroves) {
      const redemptionBuffer = lowestTroves?.troves.reduce(
        (acc, curr) =>
          acc +
          calculateRedemptionBuffer(
            Number(curr.debt),
            Number(curr.collateral),
            Number(userCollateralRatio),
          ),
        0,
      );
      setRedemptionBuffer(redemptionBuffer);
    }
  }, [lowestTroves, loadingLowestTroves, userCollateralRatio]);

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

  const datasets: ChartData<'bar', ChartDataStructure> = useMemo(() => {
    return {
      datasets: [
        {
          data: data,
          parsing: {
            xAxisKey: ChartSortingType.tx,
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
      isUserOpenTrove
    ) {
      const { transaction, trove } = userOpenTrove.trove.changes[0];

      const userTrove = [
        {
          sequenceNumber: trove.collateralRatioSortKey.toString(),
          address: trove.id,
          tx: transaction.id,
          collateralAmount: trove.collateral,
          debtAmount: trove.debt,
          collateralRatio: calculateCollateralRatio(
            trove.collateral,
            trove.debt,
            price,
          ),
        },
      ];

      const trovesDataAbove = userOpenTroveAbove.troves.map(
        ({ changes }: TroveData) => ({
          sequenceNumber: changes[0].trove.collateralRatioSortKey.toString(),
          address: changes[0].trove.id,
          tx: changes[0].transaction.id,
          collateralAmount: changes[0].trove.collateral,
          debtAmount: changes[0].trove.debt,
          collateralRatio: calculateCollateralRatio(
            changes[0].trove.collateral,
            changes[0].trove.debt,
            price,
          ),
        }),
      );

      const trovesDataBelow = userOpenTroveBelow.troves.map(
        ({ changes }: TroveData) => ({
          sequenceNumber: changes[0].trove.collateralRatioSortKey.toString(),
          address: changes[0].trove.id,
          tx: changes[0].transaction.id,
          collateralAmount: changes[0].trove.collateral,
          debtAmount: changes[0].trove.debt,
          collateralRatio: calculateCollateralRatio(
            changes[0].trove.collateral,
            changes[0].trove.debt,
            price,
          ),
        }),
      );

      setData(sortData([...trovesDataBelow, ...userTrove, ...trovesDataAbove]));

      setActiveBar(
        calculateCollateralRatio(trove.collateral, trove.debt, price),
      );
    }
  }, [
    userOpenTrove,
    isUserOpenTrove,
    userCollateralRatio,
    userOpenTroveAbove,
    userOpenTroveBelow,
    loadingUserOpenTrove,
    loadingUserOpenTroveAbove,
    loadingUserOpenTroveBelow,
    price,
    activeBar,
  ]);

  useEffect(() => {
    if (!loadingTroves && troves && !loadingUserOpenTrove && !isUserOpenTrove) {
      const trovesData = troves.troves.map(({ changes }: TroveData) => ({
        sequenceNumber: changes[0].trove.collateralRatioSortKey.toString(),
        address: changes[0].trove.id,
        tx: changes[0].transaction.id,
        collateralAmount: changes[0].trove.collateral,
        debtAmount: changes[0].trove.debt,
        collateralRatio: calculateCollateralRatio(
          changes[0].trove.collateral,
          changes[0].trove.debt,
          price,
        ),
      }));

      setData(sortData([...trovesData]));
    }
  }, [
    price,
    troves,
    loadingTroves,
    userOpenTrove,
    loadingUserOpenTrove,
    isUserOpenTrove,
  ]);

  return <Bar className="max-w-full" options={options} data={datasets} />;
};
