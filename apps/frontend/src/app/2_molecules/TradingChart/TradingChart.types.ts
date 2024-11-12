export type TradingChartProps = {
  pair: string;
};

export enum SeriesStyle {
  Bars = 0,
  Candles = 1,
  Line = 2,
  Area = 3,
  HeikenAshi = 8,
  HollowCandles = 9,
  Renko = 4,
  Kagi = 5,
  PointAndFigure = 6,
  LineBreak = 7,
}

export type Bar = {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  volume?: number;
};

export type CandleSticksResponse = {
  id: string;
  open: number;
  high: number;
  low: number;
  close: number;
  totalVolume: number;
  periodStartUnix: number;
};

export type TimestampChunk = {
  from: number;
  to: number;
};

export type Candle = {
  open: string;
  high: string;
  low: string;
  close: string;
  totalVolume: string;
  periodStartUnix: string;
};

export type StoredCharts = {
  [id: string]: ChartData;
};

export type ChartData = {
  id: string;
  name: string;
  symbol: string;
  resolution: string;
  content: string;
  timestamp: number;
};

export type StoredTemplates = {
  [id: string]: TemplateData;
};

export type TemplateData = {
  name: string;
  content: string;
};

export type SubItem = {
  symbolInfo: any;
  subscribeUID: string; //e.g. SOV/USDT_10
  resolution: string;
  lastBar: Bar;
  handler: Function;
  timer?: number;
};
