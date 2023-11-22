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

  const apyTickStep = useMemo(
    () => (Math.max(...mockData.apy) - Math.min(...mockData.apy)) / 6,
    [mockData.apy],
  );

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
    apyGradient?.addColorStop(0, 'rgba(114, 234, 222, 1)');
    apyGradient?.addColorStop(1, 'rgba(114, 234, 222, 0.09');

    const btcVolumeGradient = chartRef.current?.ctx?.createLinearGradient(
      0,
      0,
      0,
      400,
    );
    btcVolumeGradient?.addColorStop(0, 'rgba(130, 134, 143, 1)');
    btcVolumeGradient?.addColorStop(1, 'rgba(130, 134, 143, 0.09)');

    // const borrowedLiquidityGradient =
    //   chartRef.current?.ctx?.createLinearGradient(0, 0, 0, 400);
    // borrowedLiquidityGradient?.addColorStop(0, 'rgba(245, 140, 49, 1)');
    // borrowedLiquidityGradient?.addColorStop(1, 'rgba(245, 140, 49, 0.09)');

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
