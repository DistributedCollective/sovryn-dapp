import { useApolloClient } from '@apollo/client';

import React, {
  FC,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { IChartingLibraryWidget } from '@sovryn/charting-library/src/charting_library/charting_library.min';
import { noop } from '@sovryn/ui';

import { SeriesStyle } from './TradingChart.types';
import { hasDirectFeed } from './TradingChart.utils';
import Datafeed from './datafeed';
import Storage from './storage';
import { useLoadChartingLibrary } from './hooks/useLoadChartingLibrary';

type TradingChartProps = {
  pair: string;
};

export const TradingChart: FC<TradingChartProps> = ({ pair }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const { isLibraryLoaded } = useLoadChartingLibrary();

  const [hasCharts, setHasCharts] = useState(false);
  const [chart, setChart] = useState<IChartingLibraryWidget | null>(null);
  const client = useApolloClient();

  const disabledFeatures = useMemo(() => {
    if (!hasDirectFeed(pair)) {
      return ['header_chart_type'];
    }
    return [];
  }, [pair]);

  useEffect(() => {
    if (isLibraryLoaded && window.TradingView) {
      const widgetOptions: any = {
        debug: false,
        symbol: pair,
        datafeed: Datafeed(client),
        save_load_adapter: Storage,
        study_count_limit: 15,
        interval: '30',
        timeframe: '3D',
        container_id: chartContainerRef.current?.id || 'tv_chart_container',
        library_path: '/charting_library/',
        locale: 'en',
        load_last_chart: true,
        enabled_features: [
          'study_templates',
          'side_toolbar_in_fullscreen_mode',
        ],
        disabled_features: [
          'header_symbol_search',
          'header_compare',
          ...disabledFeatures,
        ],
        autosize: true,
        has_no_volume: false,
        has_empty_bars: false,
        theme: 'Dark',
        time_frames: [
          { text: '1d', resolution: '10', description: '1d', title: '1d' },
          { text: '3d', resolution: '30', description: '3d', title: '3d' },
          { text: '7d', resolution: '60', description: '7d', title: '7d' },
          { text: '3m', resolution: '120', description: '3m', title: '3m' },
          { text: '5y', resolution: '1W', description: '5y', title: '5y' },
        ],
      };

      const myChart = new (window as any).TradingView.widget(widgetOptions);
      setChart(myChart);
      myChart.onChartReady(() => {
        setHasCharts(true);
      });

      return () => {
        myChart.remove();
        setHasCharts(false);
        setChart(null);
      };
    }
  }, [client, disabledFeatures, pair, isLibraryLoaded]);

  useLayoutEffect(() => {
    if (chart && hasCharts) {
      chart.chart().resetData();

      // if quote asset is not BTC or XUSD, make it line chart, otherwise candle
      chart
        .chart()
        .setChartType(
          (hasDirectFeed(pair)
            ? SeriesStyle.Candles
            : SeriesStyle.Line) as number,
        );

      chart.chart().setSymbol(pair, noop);
    }
  }, [chart, hasCharts, pair]);

  return (
    <div className="mt-12 w-full p-0 sm:border sm:border-gray-50 sm:rounded sm:p-6 sm:bg-gray-90">
      <div id="tv_chart_container" className="h-full" />
    </div>
  );
};
