import { LendingPool } from '../../../../../utils/LendingPool';
import { MockData } from '../LendFrameChart.types';

export const useGetLendFrameChartOptions = (
  lendAPYTickStep: number,
  mockData: MockData,
  pool: LendingPool,
) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    pointStyle: false,
    radius: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: '#2C303B',
      },
      legend: {
        labels: {
          color: '#f5f5f5',
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
      y1: {
        border: {
          color: '#484D59',
        },
        position: 'left' as const,
        display: true,
        title: {
          display: true,
          text: 'Lend APY',
          color: '#B6BAC2',
        },
        ticks: {
          callback: value => Number(value).toFixed(0) + '%',
          stepSize: lendAPYTickStep,
          min: Math.min(...mockData.lendAPY) - 3 * lendAPYTickStep,
          max: Math.max(...mockData.lendAPY) + 3 * lendAPYTickStep,
          color: '#B6BAC2',
          font: {
            family: 'Roboto',
            fontSize: 12,
            fontWeight: 500,
          },
          padding: 5,
        },
        grid: {
          drawOnChartArea: true,
          drawTicks: true,
          gridDashType: 'dash',
          tickColor: '#484D59',
        },
      },
      y: {
        border: {
          color: '#484D59',
        },
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: `Borrowed/Available ${pool.getAsset().toUpperCase()}`,
          color: '#B6BAC2',
        },
        grid: {
          drawTicks: true,
          tickColor: '#484D59',
        },
        ticks: {
          color: '#B6BAC2',
          font: {
            family: 'Roboto',
            fontSize: 12,
            fontWeight: 500,
          },
          padding: 5,
        },
      },
      x: {
        border: {
          color: '#484D59',
        },
        grid: {
          drawTicks: true,
          tickColor: '#484D59',
        },
        display: true,
        ticks: {
          color: '#B6BAC2',
          font: {
            family: 'Roboto',
            fontSize: 12,
            fontWeight: 500,
          },
          padding: 15,
        },
      },
    },
    stacked: false,
  };
};
