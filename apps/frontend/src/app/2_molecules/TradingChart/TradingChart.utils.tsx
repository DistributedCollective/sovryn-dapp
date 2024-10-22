import EventEmitter from 'events';

import { getContract } from '@sovryn/contracts';

import { getCurrentChain } from '../../../hooks/useChainStore';
import { isMainnet } from '../../../utils/helpers';
import {
  MAXIMUM_CHUNK_SIZE,
  SOVRYN_INDEXER_MAINNET,
  SOVRYN_INDEXER_TESTNET,
} from './TradingChart.constants';
import { Bar, TimestampChunk } from './TradingChart.types';
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

const splitPeriodToChunks = (
  from: number,
  to: number,
  candleDetails: CandleDetails,
): TimestampChunk[] => {
  const timeSpanSeconds = to - from;
  const candlesInPeriod = Math.abs(
    Math.floor(timeSpanSeconds / candleDetails.candleSeconds),
  );

  const chunks =
    candlesInPeriod > MAXIMUM_CHUNK_SIZE
      ? Math.ceil(candlesInPeriod / MAXIMUM_CHUNK_SIZE)
      : 1;

  let _from = from;
  let _to = from;

  const times: TimestampChunk[] = [];

  if (candlesInPeriod > MAXIMUM_CHUNK_SIZE) {
    const delay = MAXIMUM_CHUNK_SIZE * candleDetails.candleSeconds;
    for (let chunk = 0; chunk < chunks; chunk++) {
      _from = chunk === 0 ? from : _to;
      _to = _from + delay < to ? _from + delay : to;
      times.push({ from: _from, to: _to });
    }
    return times;
  }

  return [{ from, to }];
};

export const queryPairByChunks = async (
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
): Promise<Bar[]> => {
  const queries = splitPeriodToChunks(startTime, endTime, candleDetails).map(
    item =>
      queryCandles(candleDetails, baseToken, quoteToken, item.from, item.to),
  );

  console.log(`queries.length: ${queries.length}`);

  return Promise.all(queries).then(items =>
    items.flat(1).sort((a, b) => a.time - b.time),
  );
};

export const queryCandles = async (
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
) => {
  try {
    const fullIndexerUrl = `${indexerBaseUrl}base=${baseToken}&quote=${quoteToken}&start=${startTime}&end=${endTime}&timeframe=${candleDetails.candleSymbol}`;
    //const fullIndexerUrl = `${indexerBaseUrl}base=${baseToken}&quote=${quoteToken}&start=1728632892&end=1729158509&timeframe=${candleDetails.candleSymbol}`;

    console.log(`startTime: ${startTime} , endTime: ${endTime}`);
    const result = await (await fetch(fullIndexerUrl)).json();

    const bars: Bar[] = result.data.map(item => ({
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
