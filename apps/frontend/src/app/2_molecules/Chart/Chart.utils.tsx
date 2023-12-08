import { MockData } from './Chart.types';

export const getChartOptions = (
  tickStep: number,
  mockData: MockData,
  yLabel1: string,
  yLabel2: string,
) => {
  const primaryColor = '#2C303B';
  const textColor = '#f5f5f5';
  const borderColor = '#484D59';
  const fontFamily = 'Roboto';
  const fontSize = 12;
  const fontWeight = '500';
  const dashGridType = 'dash';

  const data1AxisOptions = {
    border: {
      color: borderColor,
    },
    position: 'left' as const,
    display: true,
    title: {
      display: true,
      text: yLabel1,
      color: textColor,
    },
    ticks: {
      callback: value => Number(value).toFixed(3) + '%',
      stepSize: tickStep,
      min: Math.min(...mockData.data1) - 3 * tickStep,
      max: Math.max(...mockData.data1) + 3 * tickStep,
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

  const data2AxisOptions = {
    border: {
      color: borderColor,
    },
    display: true,
    position: 'right' as const,
    title: {
      display: true,
      text: yLabel2,
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
) => {
  return {
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
