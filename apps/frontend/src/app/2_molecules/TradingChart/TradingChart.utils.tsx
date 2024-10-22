import EventEmitter from 'events';

import { getContract } from '@sovryn/contracts';

import { getCurrentChain } from '../../../hooks/useChainStore';
import { isMainnet } from '../../../utils/helpers';
import {
  SOVRYN_INDEXER_MAINNET,
  SOVRYN_INDEXER_TESTNET,
} from './TradingChart.constants';
import { Bar } from './TradingChart.types';
import { CandleDetails } from './dictionary';

const pushes: Record<string, number> = {};
const hub = new EventEmitter({ captureRejections: true });

export const pushPrice = (symbol: string, price: number) => {
  pushes[symbol] = price;
  hub.emit(symbol, price);
};

const indexerBaseUrl = isMainnet()
  ? SOVRYN_INDEXER_MAINNET
  : SOVRYN_INDEXER_TESTNET;

export const queryCandles = async (
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
) => {
  try {
    const fullIndexerUrl = `${indexerBaseUrl}base=${baseToken}&quote=${quoteToken}&start=${startTime}&end=${endTime}&timeframe=${candleDetails.candleSymbol}`;

    const result = await (await fetch(fullIndexerUrl)).json();

    const bars: Bar[] = result.data.reverse().map(item => ({
      time: Number(item.date) * 1000,
      low: item.low,
      high: item.high,
      open: item.open,
      close: item.close,
    }));

    return bars;
  } catch (error) {
    console.error(error);
    throw new Error(`Request error: ${error}`);
  }
};

const getTokenAddress = async (asset: string) => {
  const { address } = await getContract(asset, 'assets', getCurrentChain());
  return address;
};

export const getTokensFromSymbol = (symbol: string) => {
  let [base, quote] = symbol.split('/');
  return {
    baseToken: getTokenAddress(base),
    quoteToken: getTokenAddress(quote),
  };
};
