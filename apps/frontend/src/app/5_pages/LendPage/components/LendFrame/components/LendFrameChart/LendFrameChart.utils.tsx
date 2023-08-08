import dayjs from 'dayjs';
import { t } from 'i18next';

import { getTokenDisplayName } from '../../../../../../../constants/tokens';
import { translations } from '../../../../../../../locales/i18n';
import { LendingPool } from '../../../../utils/LendingPool';
import { MockData, PoolHistoryData } from './LendFrameChart.types';

//TODO - it will be removed after API is ready
// export const generateDates = (): string[] => {
//   const currentDate = dayjs();
//   const dayOfMonth = currentDate.date();
//   // const year = currentDate.year();
//   // const month = currentDate.month() + 1; // Note: dayjs months are zero-based, so we add 1.

//   let dates: string[] = [];

//   if (dayOfMonth <= 15) {
//     // Dates when today's date is between 1-15 of this month
//     dates = [
//       // 15th of the month three months ago
//       currentDate.subtract(3, 'month').date(15).format('YYYY-MM-DD'),
//       // 1st of the month two months ago
//       currentDate.subtract(2, 'month').date(1).format('YYYY-MM-DD'),
//       // 15th of the month two months ago
//       currentDate.subtract(2, 'month').date(15).format('YYYY-MM-DD'),
//       // 1st of the month one month ago
//       currentDate.subtract(1, 'month').date(1).format('YYYY-MM-DD'),
//       // 15th of the month one month ago
//       currentDate.subtract(1, 'month').date(15).format('YYYY-MM-DD'),
//       // 1st of this month
//       currentDate.date(1).format('YYYY-MM-DD'),
//     ];
//   } else {
//     // Dates when today's date is between 15-last day of this month
//     dates = [
//       // 1st of the month two months ago
//       currentDate.subtract(2, 'month').date(1).format('YYYY-MM-DD'),
//       // 15th of the month two months ago
//       currentDate.subtract(2, 'month').date(15).format('YYYY-MM-DD'),
//       // 1st of the month one month ago
//       currentDate.subtract(1, 'month').date(1).format('YYYY-MM-DD'),
//       // 15th of the month one month ago
//       currentDate.subtract(1, 'month').date(15).format('YYYY-MM-DD'),
//       // 1st of this month
//       currentDate.date(1).format('YYYY-MM-DD'),
//       // 15th of this month
//       currentDate.date(15).format('YYYY-MM-DD'),
//     ];
//   }

//   return dates;
// };

export const convertPoolHistoryToMockData = (
  poolHistory: PoolHistoryData[],
): MockData => {
  const dates = poolHistory.map(entry =>
    dayjs(entry.timestamp).format('YYYY-MM-DD'),
  );
  const lendAPY = poolHistory.map(entry => parseFloat(entry.supply_apr));
  const totalLiquidity = poolHistory.map(entry => parseFloat(entry.supply));

  return {
    dates,
    lendAPY,
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
  lendApyGradient: CanvasGradient | undefined,
  totalLiquidityGradient: CanvasGradient | undefined,
) => {
  return {
    labels: mockData.dates,
    datasets: [
      {
        label: t(translations.lendPage.table.lendApy),
        data: mockData.lendAPY,
        backgroundColor: lendApyGradient,
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
  lendAPYTickStep: number,
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

  const lendAPYAxisOptions = {
    border: {
      color: borderColor,
    },
    position: 'left' as const,
    display: true,
    title: {
      display: true,
      text: t(translations.lendPage.table.lendApy),
      color: textColor,
    },
    ticks: {
      callback: value => Number(value).toFixed(3) + '%',
      stepSize: lendAPYTickStep,
      min: Math.min(...mockData.lendAPY) - 3 * lendAPYTickStep,
      max: Math.max(...mockData.lendAPY) + 3 * lendAPYTickStep,
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
      y1: lendAPYAxisOptions,
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
