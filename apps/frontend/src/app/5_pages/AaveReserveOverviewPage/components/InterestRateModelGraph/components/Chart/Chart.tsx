import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';

import ChartLibrary from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

import { theme } from '@sovryn/tailwindcss-config';

import {
  CUSTOM_CANVAS_BACKGROUND_COLOR,
  GRID_COLOR,
  TICK_COLOR,
} from './Chart.constants';
import { RatesData } from './Chart.types';
import { htmlLegendPlugin } from './Chart.utils';

type ChartProps = {
  meta: {
    label: string;
    lineColor: string;
  };
  rates: RatesData;
};

const calcInterestRateModel = (
  u: number,
  base: number,
  optimal: number,
  slope1: number,
  slope2: number,
) => {
  if (u === 0) return 0;

  if (u <= optimal) return base + (u / optimal) * slope1;

  return base + slope1 + ((u - optimal) / (1 - optimal)) * slope2;
};

const calcVariableInterestRateModel = (u: number, rates: RatesData) => {
  const base = parseFloat(rates.baseVariableBorrowRate);
  const optimal = parseFloat(rates.optimalUsageRatio);
  const slope1 = parseFloat(rates.variableRateSlope1);
  const slope2 = parseFloat(rates.variableRateSlope2);

  return calcInterestRateModel(u, base, optimal, slope1, slope2);
};
const CHART_PERCENTAGES = [0, 0.25, 0.5, 0.75, 1];

export const Chart: FC<ChartProps> = ({ meta, rates }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartLibrary | null>(null);

  const variableValues = useMemo(
    () =>
      CHART_PERCENTAGES.map(x => ({
        x: x * 100,
        y: calcVariableInterestRateModel(x, rates) * 100,
      })),
    [rates],
  );

  const optimalPercentage = parseFloat(
    (parseFloat(rates.optimalUsageRatio) * 100).toFixed(2),
  );
  const currentPercentage = parseFloat(
    (parseFloat(rates.currentUsageRatio) * 100).toFixed(2),
  );

  const optimalValue = useMemo(() => {
    return [
      { x: optimalPercentage, y: 0 },
      { x: optimalPercentage, y: 75 },
    ];
  }, [optimalPercentage]);

  const currentValue = useMemo(() => {
    return [
      { x: currentPercentage, y: 0 },
      { x: currentPercentage, y: 75 },
    ];
  }, [currentPercentage]);

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
              //maxTicksLimit: 5,
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
