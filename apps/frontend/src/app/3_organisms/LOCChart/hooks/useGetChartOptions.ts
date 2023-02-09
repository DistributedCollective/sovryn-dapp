import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { prettyTx } from '@sovryn/ui';

import { translations } from '../../../../locales/i18n';
import { Bitcoin } from '../../../../utils/constants';
import { formatValue } from '../../../../utils/math';
import { chartConfig } from '../utils';

export const useGetChartOptions = (
  userCollateralRatio: string,
  redemptionBuffer: number,
  activeBar: number | null,
  userTrovesBelowCount: number,
) => {
  const { t } = useTranslation();
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
                6,
              )} ${Bitcoin}`,
              `${t(translations.chart.debtAmount)}: ${formatValue(
                Number(debtAmount),
                2,
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
                  2,
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
