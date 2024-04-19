import { useState, useRef, useCallback } from 'react';

import axios, { Canceler } from 'axios';

import { useInterval } from '../../../../../../hooks/useInterval';
import {
  DEFAULT_LOCKED_DATA,
  DEFAULT_VOLUME_DATA,
  LOCKED_DATA_URL,
  VOLUME_DATA_URL,
  DATA_REFRESH_INTERVAL,
} from '../ProtocolData.constants';

export const useGetData = () => {
  const [lockedData, setLockedData] = useState(DEFAULT_LOCKED_DATA);
  const cancelLockedDataRequest = useRef<Canceler>();

  const [volumeData, setVolumeData] = useState(DEFAULT_VOLUME_DATA);
  const cancelVolumeDataRequest = useRef<Canceler>();

  const fetchLockedData = useCallback(() => {
    cancelLockedDataRequest.current && cancelLockedDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelLockedDataRequest.current = c;
    });

    axios
      .get(LOCKED_DATA_URL, {
        params: {
          stmp: Date.now(),
        },
        cancelToken,
      })
      .then(result => {
        setLockedData(result.data);
      })
      .catch(() => {});
  }, []);

  const fetchVolumeData = useCallback(() => {
    cancelVolumeDataRequest.current && cancelVolumeDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelVolumeDataRequest.current = c;
    });

    axios
      .get(VOLUME_DATA_URL, {
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
      })
      .then(result => {
        setVolumeData({
          btc: result.data?.total_volume_btc || 0,
          usd: result.data?.total_volume_usd || 0,
        });
      })
      .catch(() => {});
  }, []);

  useInterval(
    () => {
      fetchLockedData();
      fetchVolumeData();
    },
    DATA_REFRESH_INTERVAL,
    { immediate: true },
  );

  return { lockedData, volumeData };
};
