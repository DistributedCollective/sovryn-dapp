import { useState, useRef, useCallback } from 'react';

import axios, { Canceler } from 'axios';

import { useInterval } from '../../../../../../hooks/useInterval';
import { DATA_REFRESH_INTERVAL } from '../../../../LandingPage/components/ProtocolData/ProtocolData.constants';
import { ASSET_DATA_URL } from '../../../ProtocolData.constants';
import { Assets } from '../PricesBy24hChange.types';

export const useGetAssetData = () => {
  const [assetData, setAssetData] = useState<Assets>();
  const cancelPairsDataRequest = useRef<Canceler>();

  const fetchPairsData = useCallback(() => {
    cancelPairsDataRequest.current && cancelPairsDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelPairsDataRequest.current = c;
    });

    axios
      .get(ASSET_DATA_URL, {
        cancelToken,
      })
      .then(res => setAssetData(res.data));
  }, []);

  useInterval(
    () => {
      fetchPairsData();
    },
    DATA_REFRESH_INTERVAL,
    { immediate: true },
  );

  return assetData;
};
