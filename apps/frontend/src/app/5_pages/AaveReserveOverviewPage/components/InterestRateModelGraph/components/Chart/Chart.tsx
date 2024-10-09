import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';

import ChartLibrary from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

import { theme } from '@sovryn/tailwindcss-config';

import {
  CHART_PERCENTAGES,
  CUSTOM_CANVAS_BACKGROUND_COLOR,
  GRID_COLOR,
  TICK_COLOR,
} from './Chart.constants';
import { RatesData } from './Chart.types';
import {
  calculateVariableInterestRateModel,
  htmlLegendPlugin,
} from './Chart.utils';

type ChartProps = {
  meta: {
    label: string;
    lineColor: string;
  };
  rates: RatesData;
};

export const Chart: FC<ChartProps> = ({ meta, rates }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartLibrary | null>(null);

  const variableValues = useMemo(
    () =>
      CHART_PERCENTAGES.map(x => ({
        x: x * 100,
        y: calculateVariableInterestRateModel(x, rates).mul(100).toNumber(),
      })),
    [rates],
  );

  const optimalPercentage = useMemo(
    () =>
      rates.optimalUsageRatio
        ? Math.round(rates.optimalUsageRatio.mul(100).toNumber() * 100) / 100
        : 0,
    [rates.optimalUsageRatio],
  );

  const currentPercentage = useMemo(
    () =>
      rates.currentUsageRatio
        ? Math.round(rates.currentUsageRatio.mul(100).toNumber() * 100) / 100
        : 0,
    [rates.currentUsageRatio],
  );

  const optimalValue = useMemo(
    () => [
      { x: optimalPercentage, y: 0 },
      { x: optimalPercentage, y: 75 },
    ],
    [optimalPercentage],
  );

  const currentValue = useMemo(
    () => [
      { x: currentPercentage, y: 0 },
      { x: currentPercentage, y: 75 },
    ],
    [currentPercentage],
  );

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
        labels: ['0 %', '25 %', '50 %', '75 %', '100 %'],
        datasets: [
          {
            type: 'line',
            label: meta.label,
            data: variableValues,
            backgroundColor: meta.lineColor,
            borderColor: meta.lineColor,
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
          },
          {
            label: `Optimal ${optimalPercentage}%`,
            type: 'scatter',
            data: optimalValue,
            borderColor: theme.colors.success,
            backgroundColor: theme.colors.success,
            showLine: true,
            borderDash: [1, 2],
            pointRadius: 0,
          },
          {
            label: `Current ${currentPercentage}%`,
            type: 'scatter',
            data: currentValue,
            borderColor: theme.colors.positive,
            backgroundColor: theme.colors.positive,
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
              tickBorderDash: [5, 5],
              drawTicks: false,
            },
          },
        },
        responsive: true,
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
  }, [
    meta,
    variableValues,
    currentPercentage,
    optimalPercentage,
    optimalValue,
    currentValue,
  ]);

  const stopPropagation = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
    },
    [],
  );

  return (
    <div onClick={stopPropagation} className="lg:p-6 lg:bg-gray-80">
      <span id="legend-container-interest-chart" className="text-tiny"></span>
      <canvas ref={canvas}></canvas>
    </div>
  );
};
