import React, { FC, useEffect, useRef } from 'react';

import ChartLibrary from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

import {
  CUSTOM_CANVAS_BACKGROUND_COLOR,
  GRID_COLOR,
  TICK_COLOR,
} from './Chart.constants';
import { MockData } from './Chart.types';
import { htmlLegendPlugin } from './Chart.utils';

type ChartProps = {
  mockData: MockData<{ x: number; y: number }>;
  yLabel1: string;
};

export const Chart: FC<ChartProps> = ({ mockData }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartLibrary | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (!canvas.current) {
      return;
    }

    chartRef.current = new ChartLibrary(canvas.current, {
      type: 'line',
      data: {
        labels: ['0%', '50%', '100%'],
        datasets: [
          {
            type: 'line',
            label: mockData.label1,
            data: mockData.data1,
            backgroundColor: mockData.lineColor,
            borderColor: mockData.lineColor,
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
          },
          {
            label: 'Current 78.64%',
            type: 'scatter',
            data: mockData.data2,
            backgroundColor: 'cyan',
            borderColor: 'cyan',
            showLine: true,
            borderDash: [1, 2],
            pointRadius: 0,
          },
          {
            label: 'Optimal 92%',
            type: 'scatter',
            data: mockData.data3,
            backgroundColor: '#4caf51',
            borderColor: '#4caf51',
            showLine: true,
            borderDash: [1, 2],
            pointRadius: 0,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            min: 0,
            max: 100,
            ticks: {
              color: TICK_COLOR,
              callback: function (value) {
                return value + '%';
              },
              maxTicksLimit: 5,
              align: 'center',
            },
          },
          y: {
            min: 0,
            max: 100,
            ticks: {
              color: '#b6bac1',
              callback: function (value) {
                return value + '%';
              },
              maxTicksLimit: 5,
              align: 'center',
            },
            grid: {
              color: GRID_COLOR,
              lineWidth: 1,
              drawOnChartArea: true,
              tickBorderDash: [5, 5],
              tickBorderDashOffset: 0,
            },
          },
        },
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
      plugins: [CUSTOM_CANVAS_BACKGROUND_COLOR, htmlLegendPlugin],
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [mockData]);

  return (
    <div
      onClick={e => {
        e.stopPropagation();
      }}
      className="w-full rounded"
    >
      <span id="legend-container-interest-chart" className="text-tiny"></span>
      <canvas ref={canvas}></canvas>
    </div>
  );
};
