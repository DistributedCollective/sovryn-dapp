import React, { FC, useEffect, useRef, useMemo, memo } from 'react';

import Chart from 'chart.js/auto';

import { LendFrameProps } from '../../LendFrame.types';
import {
  convertPoolHistoryToMockData,
  customCanvasBackgroundColor,
  getChartOptions,
  getChartData,
} from './LendFrameChart.utils';
import { useGetLendHistory } from './hooks/useGetLendHistory';

export const LendFrameChart: FC<LendFrameProps> = memo(({ pool }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const asset = useMemo(() => pool.getAsset(), [pool]);
  const chartRef = useRef<Chart | null>(null);
  const { lendHistory } = useGetLendHistory(asset);

  const mockData = convertPoolHistoryToMockData(lendHistory);
  const lendAPYTickStep = useMemo(
    () => (Math.max(...mockData.lendAPY) - Math.min(...mockData.lendAPY)) / 6,
    [mockData.lendAPY],
  );

  const chartOptions = useMemo(
    () => getChartOptions(lendAPYTickStep, mockData, pool),
    [lendAPYTickStep, mockData, pool],
  );

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (!canvas.current) {
      return;
    }

    const lendApyGradient = chartRef.current?.ctx?.createLinearGradient(
      0,
      0,
      0,
      400,
    );
    lendApyGradient?.addColorStop(0, 'rgba(114, 234, 222, 1)');
    lendApyGradient?.addColorStop(1, 'rgba(114, 234, 222, 0.09');

    const totalLiquidityGradient = chartRef.current?.ctx?.createLinearGradient(
      0,
      0,
      0,
      400,
    );
    totalLiquidityGradient?.addColorStop(0, 'rgba(130, 134, 143, 1)');
    totalLiquidityGradient?.addColorStop(1, 'rgba(130, 134, 143, 0.09)');

    const borrowedLiquidityGradient =
      chartRef.current?.ctx?.createLinearGradient(0, 0, 0, 400);
    borrowedLiquidityGradient?.addColorStop(0, 'rgba(245, 140, 49, 1)');
    borrowedLiquidityGradient?.addColorStop(1, 'rgba(245, 140, 49, 0.09)');

    chartRef.current = new Chart(canvas.current, {
      type: 'line',
      data: getChartData(mockData, lendApyGradient, totalLiquidityGradient),
      options: chartOptions,
      plugins: [customCanvasBackgroundColor],
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [mockData, chartOptions, asset]);

  return (
    <div className="lg:h-[37rem] h-64 rounded">
      <canvas ref={canvas}></canvas>
    </div>
  );
});