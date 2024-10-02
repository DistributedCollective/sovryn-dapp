/**
 * TradingChart Datafeed
 *
 * Implementation of TradingView Charting Library JS API (v18.043):
 * https://github.com/tradingview/charting_library/wiki/JS-Api/f62fddae9ad1923b9f4c97dbbde1e62ff437b924
 *
 * If the version of the library is updated, then modifications may
 * be necessary to this file and the realtime streaming.ts file in
 * this directory. Refer to:
 * https://github.com/tradingview/charting_library/wiki/Breaking-Changes
 */
import { ApolloClient } from '@apollo/client';

import {
  ChartingLibraryWidgetOptions,
  LibrarySymbolInfo,
} from '@sovryn/charting-library/src/charting_library/charting_library.min';

import {
  config,
  resolutionMap,
  supportedResolutions,
  getTokensFromSymbol,
  hasDirectFeed,
  queryPairByChunks,
  pushPrice,
} from './TradingChart.utils';
import { TradingCandleDictionary } from './dictionary';
import { CandleDuration } from './hooks/useGetCandles';
import { stream } from './streaming';
import { Bar } from './TradingChart.types';

const newestBarsCache = new Map<string, Bar>();
const oldestBarsCache = new Map<string, Bar>();

const tradingChartDataFeeds = (
  graphqlClient: ApolloClient<any>,
): ChartingLibraryWidgetOptions['datafeed'] => ({
  onReady: callback => setTimeout(() => callback(config)),
  searchSymbols: () => {},
  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
  ) => {
    const symbolInfo: LibrarySymbolInfo = {
      name: symbolName,
      full_name: symbolName,
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
      has_no_volume: false,
      has_empty_bars: false,
      has_daily: true,
      has_weekly_and_monthly: false,
      data_status: 'streaming',
    };

    setTimeout(() => onSymbolResolvedCallback(symbolInfo));
  },
  getBars: async (
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest,
  ) => {
    const candleDuration: CandleDuration = resolutionMap[resolution];
    const candleDetails = TradingCandleDictionary.get(candleDuration);

    const fromTime = (): number => {
      const oldestBarTime = oldestBarsCache.get(symbolInfo.name)?.time;
      if (firstDataRequest) {
        return from;
      } else if (oldestBarTime !== undefined) {
        if (from < oldestBarTime / 1e3) {
          return from;
        }
        return oldestBarTime / 1e3 - candleDetails.candleSeconds;
      } else {
        return from;
      }
    };

    try {
      const { baseToken, quoteToken } = getTokensFromSymbol(symbolInfo.name);
      console.log('baseToken', baseToken);
      console.log('quoteToken', quoteToken);

      let items = await queryPairByChunks(
        graphqlClient,
        candleDetails,
        await baseToken,
        await quoteToken,
        fromTime(),
        Math.floor(
          Math.min(to + candleDetails.candleSeconds, Date.now() / 1e3),
        ),
        hasDirectFeed(symbolInfo.name),
      );

      if (!items || items.length === 0) {
        onHistoryCallback([], {
          noData: true,
        });
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

      onHistoryCallback(items, {
        noData: false,
      });
    } catch (error) {
      console.log('error', error);
      onErrorCallback(error);
    }
  },
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    const candleDetails = TradingCandleDictionary.get(
      resolutionMap[resolution],
    );
    return {
      resolutionBack: candleDetails.resolutionBack,
      intervalBack: candleDetails.intervalBack,
    };
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
