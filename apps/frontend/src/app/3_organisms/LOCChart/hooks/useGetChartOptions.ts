import { t } from 'i18next';

import { prettyTx } from '@sovryn/ui';

import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../constants/currencies';
import { translations } from '../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../utils/asset';
import { areAddressesEqual } from '../../../../utils/helpers';
import { formatValue } from '../../../../utils/math';
import { chartConfig } from '../utils';
import { useAccount } from './../../../../hooks/useAccount';

export const useGetChartOptions = (
  activeBar: boolean,
  redemptionBuffer: number,
  userTrovesBelowCount: number,
) => {
  const { account } = useAccount();
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
            const { collateral, id, debt, collateralRatio } = context[0].raw;
            const tooltipContent = [
              prettyTx(id),
              `${t(translations.chart.collateralAmount)}: ${formatValue(
                Number(collateral),
                BTC_RENDER_PRECISION,
              )} ${BITCOIN}`,
              `${t(translations.chart.debtAmount)}: ${formatValue(
                Number(debt),
                TOKEN_RENDER_PRECISION,
              )} ${COMMON_SYMBOLS.ZUSD.toUpperCase()}`,
              `${t(translations.chart.collateralRatio)}: ${formatValue(
                Number(collateralRatio),
                0,
              )}%`,
            ];

            if (areAddressesEqual(context[0].raw.id, account) && activeBar) {
              tooltipContent.push(
                `${t(translations.chart.redemptionBuffer)}: ${formatValue(
                  redemptionBuffer,
                  TOKEN_RENDER_PRECISION,
                )} ${COMMON_SYMBOLS.ZUSD.toUpperCase()}`,
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
          callback: value =>
            Number(userTrovesBelowCount + value + 1).toFixed(0),
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
};
