import { useCallback, useEffect, useState } from 'react';

import axios from 'axios';
import dayjs from 'dayjs';

import { AAVE_CONTRACT_ADDRESSES } from '../../constants/aave';

export enum ESupportedTimeRanges {
  OneMonth = '1m',
  ThreeMonths = '3m',
  SixMonths = '6m',
  OneYear = '1y',
  TwoYears = '2y',
  FiveYears = '5y',
}

export const reserveRateTimeRangeOptions = [
  ESupportedTimeRanges.OneMonth,
  ESupportedTimeRanges.SixMonths,
  ESupportedTimeRanges.OneYear,
];
export type ReserveRateTimeRange = typeof reserveRateTimeRangeOptions[number];

type RatesHistoryParams = {
  from: number;
  resolutionInHours: number;
};

type APIResponse = {
  liquidityRate_avg: number;
  variableBorrowRate_avg: number;
  stableBorrowRate_avg: number;
  utilizationRate_avg: number;
  x: { year: number; month: number; date: number; hours: number };
};

const requestCache = new Map<string, Promise<APIResponse[]>>();
const fetchStats = async (
  reserveId: string,
  timeRange: ReserveRateTimeRange,
  endpointURL: string,
): Promise<APIResponse[]> => {
  const { from, resolutionInHours } = resolutionForTimeRange(timeRange);
  const qs = `reserveId=${reserveId}&from=${from}&resolutionInHours=${resolutionInHours}`;
  const url = `${endpointURL}?${qs}`;

  if (requestCache.has(url)) {
    return requestCache.get(url)!;
  }

  const requestPromise = axios
    .get<APIResponse[]>(url)
    .then(response => response.data)
    .finally(() => {
      requestCache.delete(url);
    });

  requestCache.set(url, requestPromise);

  return requestPromise;
};

const resolutionForTimeRange = (
  timeRange: ReserveRateTimeRange,
): RatesHistoryParams => {
  switch (timeRange) {
    case ESupportedTimeRanges.OneMonth:
      return {
        from: dayjs().subtract(1, 'month').unix(),
        resolutionInHours: 6,
      };
    case ESupportedTimeRanges.SixMonths:
      return {
        from: dayjs().subtract(6, 'month').unix(),
        resolutionInHours: 24,
      };
    case ESupportedTimeRanges.OneYear:
      return {
        from: dayjs().subtract(1, 'year').unix(),
        resolutionInHours: 24,
      };
    default:
      return {
        // Return today as a fallback
        from: dayjs().unix(),
        resolutionInHours: 6,
      };
  }
};

export type FormattedReserveHistoryItem = {
  date: number;
  liquidityRate: number;
  variableBorrowRate: number;
};

export function useAaveReservesHistory(
  reserveId: string,
  timeRange: ReserveRateTimeRange,
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<FormattedReserveHistoryItem[]>([]);

  const refetchData = useCallback(() => {
    if (reserveId && AAVE_CONTRACT_ADDRESSES.RATES_HISTORY_API_URL) {
      // reset
      setLoading(true);
      setError(false);
      setData([]);
      fetchStats(
        reserveId,
        timeRange,
        AAVE_CONTRACT_ADDRESSES.RATES_HISTORY_API_URL,
      )
        .then((data: APIResponse[]) => {
          setData(
            data.map(d => ({
              date: dayjs()
                .set('year', d.x.year)
                .set('month', d.x.month)
                .set('date', d.x.date)
                .set('hour', d.x.hours)
                .valueOf(),
              liquidityRate: d.liquidityRate_avg,
              variableBorrowRate: d.variableBorrowRate_avg,
            })),
          );
        })
        .catch(e => {
          console.error(
            'useReservesHistory(): Failed to fetch historical reserve data.',
            e,
          );
          setError(true);
        })
        .finally(() => setLoading(false));
    }

    return () => null;
  }, [reserveId, timeRange]);

  useEffect(() => {
    refetchData();
  }, [refetchData]);
  return {
    loading,
    data,
    error,
    refetch: refetchData,
  };
}
