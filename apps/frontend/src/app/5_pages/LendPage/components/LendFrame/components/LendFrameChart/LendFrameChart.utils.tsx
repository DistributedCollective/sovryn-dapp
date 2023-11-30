import dayjs from 'dayjs';
import { t } from 'i18next';

import { getTokenDisplayName } from '../../../../../../../constants/tokens';
import { translations } from '../../../../../../../locales/i18n';
import { LendingPool } from '../../../../../../../utils/LendingPool';
import { MockData, PoolHistoryData } from './LendFrameChart.types';

export const convertPoolHistoryToMockData = (
  poolHistory: PoolHistoryData[],
): MockData => {
  const dates = poolHistory.map(entry =>
    dayjs(entry.timestamp).format('YYYY-MM-DD'),
  );
  const lendApr = poolHistory.map(entry => parseFloat(entry.supply_apr));
  const totalLiquidity = poolHistory.map(entry => parseFloat(entry.supply));

  return {
    dates,
    lendApr,
    totalLiquidity,
  };
};

export const customCanvasBackgroundColor = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#2C303B';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

export const getChartData = (
  mockData: MockData,
  lendAprGradient: CanvasGradient | undefined,
  totalLiquidityGradient: CanvasGradient | undefined,
) => {
  return {
    labels: mockData.dates,
    datasets: [
      {
        label: t(translations.lendPage.table.lendApr),
        data: mockData.lendApr,
        backgroundColor: lendAprGradient,
        borderColor: '#72EADE',
        fill: true,
        yAxisID: 'y1',
        pointRadius: 0,
      },
      {
        label: t(translations.lendPage.table.totalLiquidity),
        data: mockData.totalLiquidity,
        backgroundColor: totalLiquidityGradient,
        borderColor: '#82868F',
        fill: true,
        yAxisID: 'y',
        pointRadius: 0,
      },
    ],
  };
};

export const getChartOptions = (
  lendAprTickStep: number,
  mockData: MockData,
  pool: LendingPool,
) => {
  const primaryColor = '#2C303B';
  const textColor = '#f5f5f5';
  const borderColor = '#484D59';
  const fontFamily = 'Roboto';
  const fontSize = 12;
  const fontWeight = '500';
  const dashGridType = 'dash';

  const lendAprAxisOptions = {
    border: {
      color: borderColor,
    },
    position: 'left' as const,
    display: true,
    title: {
      display: true,
      text: t(translations.lendPage.table.lendApr),
      color: textColor,
    },
    ticks: {
      callback: value => Number(value).toFixed(3) + '%',
      stepSize: lendAprTickStep,
      min: Math.min(...mockData.lendApr) - 3 * lendAprTickStep,
      max: Math.max(...mockData.lendApr) + 3 * lendAprTickStep,
      color: textColor,
      font: {
        family: fontFamily,
        fontSize,
        fontWeight,
      },
      padding: 5,
    },
    grid: {
      drawOnChartArea: true,
      drawTicks: true,
      gridDashType: dashGridType,
      tickColor: borderColor,
    },
  };

  const borrowedAvailableAxisOptions = {
    border: {
      color: borderColor,
    },
    display: true,
    position: 'right' as const,
    title: {
      display: true,
      text: `${t(
        translations.lendPage.table.totalLiquidity,
      )} ${getTokenDisplayName(pool.getAsset())}`,
      color: textColor,
    },
    grid: {
      drawTicks: true,
      tickColor: borderColor,
    },
    ticks: {
      color: textColor,
      font: {
        family: fontFamily,
        fontSize,
        fontWeight,
      },
      padding: 5,
    },
  };

  const xAxisOptions = {
    border: {
      color: borderColor,
    },
    grid: {
      drawTicks: true,
      tickColor: borderColor,
    },
    display: true,
    ticks: {
      color: textColor,
      font: {
        family: fontFamily,
        fontSize,
        fontWeight,
      },
      padding: 15,
      maxTicksLimit: 7,
    },
  };

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      customCanvasBackgroundColor: {
        color: primaryColor,
      },
      legend: {
        labels: {
          color: textColor,
          boxWidth: 12,
          boxHeight: 12,
          padding: 20,
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      y1: lendAprAxisOptions,
      y: borrowedAvailableAxisOptions,
      x: xAxisOptions,
    },
    stacked: false,
    animations: {
      tension: {
        duration: 1000,
        from: 1,
        to: 0,
      },
    },
  };
};
