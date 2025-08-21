import { useState, useRef, useCallback, useMemo } from 'react';

import axios, { Canceler } from 'axios';

import { DATA_REFRESH_INTERVAL } from '../../../../../../constants/general';
import { useInterval } from '../../../../../../hooks/useInterval';
import { isMainnet, isStaging } from '../../../../../../utils/helpers';
import { VOLUME_DATA_URL } from '../../../ProtocolData.constants';
import { PairData } from '../PricesBy24hChange.types';

// XUSD_legacy, cannot use getContract because we don't have a mainnet contract for it
const deprecatedPair =
  '0x74858FE37d391f81F89472e1D8BC8Ef9CF67B3b1'.toLowerCase();

export const useGetCryptoPairs = () => {
  const [pairList, setPairList] = useState<PairData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const cancelPairsDataRequest = useRef<Canceler>();

  const fetchPairsData = useCallback(async () => {
    try {
      setIsLoading(true);
      cancelPairsDataRequest.current && cancelPairsDataRequest.current();

      const cancelToken = new axios.CancelToken(c => {
        cancelPairsDataRequest.current = c;
      });

      const { data } = await axios.get(VOLUME_DATA_URL, {
        params: {
          extra: true,
          stmp: Date.now(),
        },
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '30',
        },
        cancelToken,
      });

      const pairs = Object.keys(data.pairs)
        .map(key => data.pairs[key])
        .filter((pair: PairData) => pair) as PairData[];

      setPairList(pairs);
    } catch (error) {}
    setIsLoading(false);
  }, []);

  useInterval(
    () => {
      fetchPairsData();
    },
    DATA_REFRESH_INTERVAL,
    { immediate: true },
  );

  const pairs = useMemo(
    () =>
      isMainnet() || isStaging()
        ? pairList
        : pairList.filter(
            pair =>
              pair.base_id.toLowerCase() !== deprecatedPair &&
              pair.quote_id.toLowerCase() !== deprecatedPair,
          ),
    [pairList],
  );

  return {
    pairs,
    isLoading,
  };
};
