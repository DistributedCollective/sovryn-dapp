export enum CandleDuration {
  M_1 = 'M_1',
  M_10 = 'M_10',
  M_15 = 'M_15',
  M_30 = 'M_30',
  H_1 = 'H_1',
  H_4 = 'H_4',
  H_12 = 'H_12',
  D_1 = 'D_1',
  D_3 = 'D_3',
  W_1 = 'W_1',
  D_30 = 'D_30',
}

export class CandleDetails {
  /** TODO: Add default number of candles or default startTime */
  constructor(
    public entityName: string,
    public resolutionBack: 'D' | 'M',
    public intervalBack: number,
    public startDaysFromNow: number, // Number of days back to start from in default query
    public candleSeconds: number,
    public candleSymbol: string,
  ) {
    this.entityName = entityName;
    this.resolutionBack = resolutionBack;
    this.intervalBack = intervalBack;
    this.startDaysFromNow = startDaysFromNow;
    this.candleSeconds = candleSeconds;
    this.candleSymbol = candleSymbol;
  }
}

export class TradingCandleDictionary {
  public static candles: Map<CandleDuration, CandleDetails> = new Map<
    CandleDuration,
    CandleDetails
  >([
    [
      CandleDuration.M_1,
      new CandleDetails('candleSticksMinutes', 'D', 1, 5, 60, '1m'),
    ],
    [
      CandleDuration.M_10,
      new CandleDetails('candleSticksTenMinutes', 'D', 3, 5, 60 * 10, '10m'),
    ],
    [
      CandleDuration.M_15,
      new CandleDetails(
        'candleSticksFifteenMinutes',
        'D',
        3,
        5,
        60 * 15,
        '15m',
      ),
    ],
    [
      CandleDuration.M_30,
      new CandleDetails('candleSticksThirtyMinutes', 'D', 3, 5, 60 * 30, '30m'),
    ],
    [
      CandleDuration.H_1,
      new CandleDetails('candleSticksHours', 'D', 5, 5, 60 * 60, '1h'),
    ],
    [
      CandleDuration.H_4,
      new CandleDetails(
        'candleSticksFourHours',
        'D',
        10,
        10,
        60 * 60 * 4,
        '4h',
      ),
    ],
    [
      CandleDuration.H_12,
      new CandleDetails(
        'candleSticksTwelveHours',
        'D',
        10,
        10,
        60 * 60 * 12,
        '12h',
      ),
    ],
    [
      CandleDuration.D_1,
      new CandleDetails('candleSticksDays', 'D', 90, 90, 60 * 60 * 24, '1d'),
    ],
    [
      CandleDuration.D_3,
      new CandleDetails(
        'candleSticksThreeDays',
        'D',
        90,
        90,
        60 * 60 * 24 * 3,
        '3d',
      ),
    ],
    [
      CandleDuration.W_1,
      new CandleDetails(
        'candleSticksOneWeek',
        'D',
        90,
        90,
        60 * 60 * 24 * 7,
        '1w',
      ),
    ],
    [
      CandleDuration.D_30,
      new CandleDetails(
        'candleSticksOneMonth',
        'D',
        90,
        90,
        60 * 60 * 24 * 30,
        '30d',
      ),
    ],
  ]);

  public static get(candle: CandleDuration): CandleDetails {
    return this.candles.get(candle) as CandleDetails;
  }
}
