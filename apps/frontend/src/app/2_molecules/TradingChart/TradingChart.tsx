import { useApolloClient } from '@apollo/client';

import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  ResolutionString,
  widget,
} from '@sovryn/charting-library/src/charting_library';
import { noop } from '@sovryn/ui';

import { SeriesStyle, TradingChartProps } from './TradingChart.types';
import Datafeed from './datafeed';

export const TradingChart: FC<TradingChartProps> = ({ pair }) => {
  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  const [hasCharts, setHasCharts] = useState(false);
  const [chart, setChart] = useState<IChartingLibraryWidget | null>(null);
  const client = useApolloClient();

  useEffect(() => {
    try {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: pair,
        datafeed: Datafeed(client),
        interval: '1D' as ResolutionString,
        container: chartContainerRef.current,
        library_path: '/charting_library/',
        load_last_chart: true, //last chart layout (if present)
        theme: 'dark',
        locale: 'en',
        disabled_features: ['header_symbol_search', 'header_compare'],
        enabled_features: [
          'study_templates',
          'side_toolbar_in_fullscreen_mode',
        ],
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        fullscreen: false,
        autosize: true,
        studies_overrides: {},
      };

      const myChart = new widget(widgetOptions);
      setChart(myChart);
      myChart.onChartReady(() => {
        setHasCharts(true);
      });

      return () => {
        myChart.remove();
        setHasCharts(false);
        setChart(null);
      };
    } catch (e) {
      console.error(e);
      setHasCharts(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  useLayoutEffect(() => {
    if (chart && hasCharts) {
      chart.chart().resetData();

      chart.chart().setChartType(SeriesStyle.Candles as number);

      chart.chart().setSymbol(pair, noop);
    }
  }, [chart, hasCharts, pair]);

  return (
    <div className="w-full p-0 sm:border sm:border-gray-50 sm:rounded sm:p-6 sm:bg-gray-90">
      <div ref={chartContainerRef} className="h-full min-h-96" />
    </div>
  );
};
