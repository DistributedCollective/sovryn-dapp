import {
  BORDER_COLOR,
  TEXT_COLOR,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  DASH_GRID_TYPE,
  PRIMARY_COLOR,
} from './Chart.constants';
import { MockData } from './Chart.types';

export const getChartOptions = (
  tickStep: number,
  mockData: MockData,
  yLabel1: string,
  yLabel2: string,
) => {
  const data1AxisOptions = {
    border: {
      color: BORDER_COLOR,
    },
    position: 'left' as const,
    display: true,
    title: {
      display: true,
      text: yLabel1,
      color: TEXT_COLOR,
    },
    ticks: {
      callback: value => Number(value).toFixed(3) + '%',
      stepSize: tickStep,
      min: Math.min(...mockData.data1) - 3 * tickStep,
      max: Math.max(...mockData.data1) + 3 * tickStep,
      color: TEXT_COLOR,
      font: {
        family: FONT_FAMILY,
        fontSize: FONT_SIZE,
        fontWeight: FONT_WEIGHT,
      },
      padding: 5,
    },
    grid: {
      drawOnChartArea: true,
      drawTicks: true,
      gridDashType: DASH_GRID_TYPE,
      tickColor: BORDER_COLOR,
    },
  };

  const data2AxisOptions = {
    border: {
      color: BORDER_COLOR,
    },
    display: true,
    position: 'right' as const,
    title: {
      display: true,
      text: yLabel2,
      color: TEXT_COLOR,
    },
    grid: {
      drawTicks: true,
      tickColor: BORDER_COLOR,
    },
    ticks: {
      color: TEXT_COLOR,
      font: {
        family: FONT_FAMILY,
        fontSize: FONT_SIZE,
        fontWeight: FONT_WEIGHT,
      },
      padding: 5,
    },
  };

  const xAxisOptions = {
    border: {
      color: BORDER_COLOR,
    },
    grid: {
      drawTicks: true,
      tickColor: BORDER_COLOR,
    },
    display: true,
    ticks: {
      color: TEXT_COLOR,
      font: {
        family: FONT_FAMILY,
        fontSize: FONT_SIZE,
        fontWeight: FONT_WEIGHT,
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
        color: PRIMARY_COLOR,
      },
      legend: {
        labels: {
          color: TEXT_COLOR,
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
      y1: data1AxisOptions,
      y: data2AxisOptions,
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
  mockData: MockData,
  gradient1: CanvasGradient | undefined,
  gradient2: CanvasGradient | undefined,
) => ({
  labels: mockData.xLabels,
  datasets: [
    {
      label: mockData.label1,
      data: mockData.data1,
      backgroundColor: gradient1,
      borderColor: mockData.borderColor1,
      fill: true,
      yAxisID: 'y1',
      pointRadius: 0,
    },
    {
      label: mockData.label2,
      data: mockData.data2,
      backgroundColor: gradient2,
      borderColor: mockData.borderColor2,
      fill: true,
      yAxisID: 'y',
      pointRadius: 0,
    },
  ],
});
