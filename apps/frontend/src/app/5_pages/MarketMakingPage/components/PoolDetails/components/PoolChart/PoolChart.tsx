import React, { FC, useEffect, useMemo, useRef } from 'react';

import Chart from 'chart.js/auto';

import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import {
  convertPoolVolumeDataToMockData,
  getChartOptions,
  getChartData,
  customCanvasBackgroundColor,
} from './PoolChart.utils';
import { useGetPoolVolumeData } from './hooks/useGetPoolVolumeData';

type PoolChartProps = {
  pool: AmmLiquidityPool;
};

export const PoolChart: FC<PoolChartProps> = ({ pool }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const data = useGetPoolVolumeData(pool);
  const mockData = convertPoolVolumeDataToMockData(data);

  const maxApy = useMemo(
    () => Math.max(...mockData.apy) * 1.25,
    [mockData.apy],
  );
  const minApy = useMemo(
    () => Math.min(...mockData.apy) * 0.75,
    [mockData.apy],
  );

  const apyTickStep = useMemo(() => (maxApy - minApy) / 6, [maxApy, minApy]);

  const chartOptions = useMemo(
    () => getChartOptions(apyTickStep, mockData),
    [apyTickStep, mockData],
  );

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (!canvas.current) {
      return;
    }

    const apyGradient = chartRef.current?.ctx?.createLinearGradient(
      0,
      0,
      0,
      400,
    );
    apyGradient?.addColorStop(0, 'rgba(130, 134, 143, 1)');
    apyGradient?.addColorStop(1, 'rgba(130, 134, 143, 0.09)');

    const btcVolumeGradient = chartRef.current?.ctx?.createLinearGradient(
      0,
      0,
      0,
      400,
    );
    btcVolumeGradient?.addColorStop(0, 'rgba(245, 140, 49, 1)');
    btcVolumeGradient?.addColorStop(1, 'rgba(245, 140, 49, 0.09)');

    chartRef.current = new Chart(canvas.current, {
      type: 'line',
      data: getChartData(mockData, apyGradient, btcVolumeGradient),
      options: chartOptions,
      plugins: [customCanvasBackgroundColor],
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [mockData, chartOptions]);

  return (
    <div className="lg:h-[37rem] h-64 rounded">
      <canvas ref={canvas}></canvas>
    </div>
  );
};
