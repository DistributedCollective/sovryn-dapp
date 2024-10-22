import { ApolloClient } from '@apollo/client';

import {
  ChartingLibraryWidgetOptions,
  DatafeedErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  PeriodParams,
  ResolutionString,
} from '@sovryn/charting-library/src/charting_library';

import {
  config,
  resolutionMap,
  supportedResolutions,
} from './TradingChart.constants';
import { Bar } from './TradingChart.types';
import {
  getTokensFromSymbol,
  pushPrice,
  queryCandles,
} from './TradingChart.utils';
import { CandleDuration, TradingCandleDictionary } from './dictionary';
import { stream } from './streaming';

const newestBarsCache = new Map<string, Bar>();
const oldestBarsCache = new Map<string, Bar>();

const tradingChartDataFeeds = (
  graphqlClient: ApolloClient<any>,
): ChartingLibraryWidgetOptions['datafeed'] => ({
  onReady: callback => setTimeout(() => callback(config)),
  searchSymbols: () => {},
  resolveSymbol: async (symbolName, onSymbolResolvedCallback) => {
    const symbolInfo: LibrarySymbolInfo = {
      name: symbolName,
      description: '',
      type: 'crypto',
      exchange: '',
      listed_exchange: '',
      format: 'price',
      volume_precision: 6,
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      minmov: 1,
      pricescale: 10 ** 8,
      has_intraday: true,
      intraday_multipliers: ['1', '15', '60', '240'],
      supported_resolutions: supportedResolutions,
      has_empty_bars: false,
      has_daily: true,
      has_weekly_and_monthly: false,
      data_status: 'streaming',
    };

    setTimeout(() => onSymbolResolvedCallback(symbolInfo));
  },
  getBars: async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: DatafeedErrorCallback,
  ) => {
    const { from, to, firstDataRequest } = periodParams;
    const candleDuration: CandleDuration = resolutionMap[resolution];
    const candleDetails = TradingCandleDictionary.get(candleDuration);

    try {
      const { baseToken, quoteToken } = getTokensFromSymbol(symbolInfo.name);

      let items = await queryCandles(
        candleDetails,
        await baseToken,
        await quoteToken,
        from,
        to,
      );

      if (!items || items.length === 0) {
        onResult([], { noData: true });
        return;
      }

      if (firstDataRequest) {
        newestBarsCache.set(symbolInfo.name, { ...items[items.length - 1] });
        oldestBarsCache.set(symbolInfo.name, { ...items[0] });
      }

      const lastBar = newestBarsCache.get(symbolInfo.name);
      const newestBar = items[items.length - 1];

      if (!lastBar) {
        newestBarsCache.set(symbolInfo.name, newestBar);
      }

      if (lastBar && newestBar && newestBar?.time >= lastBar.time) {
        newestBarsCache.set(symbolInfo.name, newestBar);
        pushPrice(`${baseToken}/${quoteToken}`, newestBar.close);
      }

      const oldestBar = oldestBarsCache.get(symbolInfo.name);
      const currentOldest = items[0];

      if (!oldestBar) {
        oldestBarsCache.set(symbolInfo.name, currentOldest);
      }

      if (oldestBar && currentOldest && currentOldest?.time <= oldestBar.time) {
        oldestBarsCache.set(symbolInfo.name, currentOldest);
      }

      let bars: Bar[] = [];

      items.forEach(bar => {
        if (bar.time >= from * 1000 && bar.time < to * 1000) {
          bars = [...bars, bar];
        }
      });

      onResult(bars, { noData: false });
    } catch (error) {
      console.log('error', error);
      onError(error.message);
    }
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback,
  ) => {
    const newestBar = newestBarsCache.get(symbolInfo.name);
    stream.subscribeOnStream(
      graphqlClient,
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback,
      newestBar,
    );
  },
  unsubscribeBars: subscriberUID => stream.unsubscribeFromStream(subscriberUID),
});

export default tradingChartDataFeeds;
