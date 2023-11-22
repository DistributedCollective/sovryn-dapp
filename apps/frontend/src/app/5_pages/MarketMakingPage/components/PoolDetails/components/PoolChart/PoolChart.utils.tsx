import { t } from 'i18next';

import { translations } from '../../../../../../../locales/i18n';
import { PoolVolumeData } from './hooks/useGetPoolVolumeData';

export type PoolVolumeMockData = {
  dates: string[];
  apy: number[];
  btcVolumes: number[];
};

export const convertPoolVolumeDataToMockData = (
  data: PoolVolumeData[],
): PoolVolumeMockData => ({
  dates: data.map(item => item.timestamp),
  apy: data.map(item => item.apy),
  btcVolumes: data.map(item => Number(item.btcVolume)),
});

export const getChartOptions = (
  apyTickStep: number,
  mockData: PoolVolumeMockData,
) => {
  const primaryColor = '#2C303B';
  const textColor = '#f5f5f5';
  const borderColor = '#484D59';
  const fontFamily = 'Roboto';
  const fontSize = 12;
  const fontWeight = '500';
  const dashGridType = 'dash';

  const apyAxisOptions = {
    border: {
      color: borderColor,
    },
    position: 'left' as const,
    display: true,
    title: {
      display: true,
      text: t(translations.marketMakingPage.poolVolumeChart.apr),
      color: textColor,
    },
    ticks: {
      callback: value => Number(value).toFixed(3) + '%',
      stepSize: apyTickStep,
      min: Math.min(...mockData.apy) - 3 * apyTickStep,
      max: Math.max(...mockData.apy) + 3 * apyTickStep,
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

  const volumeAxisOptions = {
    border: {
      color: borderColor,
    },
    display: true,
    position: 'right' as const,
    title: {
      display: true,
      text: t(translations.marketMakingPage.poolVolumeChart.volume),
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
      y1: apyAxisOptions,
      y: volumeAxisOptions,
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

export const getChartData = (
  mockData: PoolVolumeMockData,
  apyGradient: CanvasGradient | undefined,
  btcVolumeGradient: CanvasGradient | undefined,
) => {
  return {
    labels: mockData.dates,
    datasets: [
      {
        label: t(translations.marketMakingPage.poolVolumeChart.apr),
        data: mockData.apy,
        backgroundColor: apyGradient,
        borderColor: '#72EADE',
        fill: true,
        yAxisID: 'y1',
        pointRadius: 0,
      },
      {
        label: t(translations.marketMakingPage.poolVolumeChart.volume),
        data: mockData.btcVolumes,
        backgroundColor: btcVolumeGradient,
        borderColor: '#82868F',
        fill: true,
        yAxisID: 'y',
        pointRadius: 0,
      },
    ],
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
