import { useState, useRef, useCallback } from 'react';

import axios, { Canceler } from 'axios';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { DATA_REFRESH_INTERVAL } from '../../../../../../constants/general';
import { useInterval } from '../../../../../../hooks/useInterval';
import {
  DEFAULT_VOLUME_DATA,
  VOLUME_DATA_URL,
} from '../ProtocolData.constants';

export const useGetRSKVolume = () => {
  const [volumeData, setVolumeData] = useState(DEFAULT_VOLUME_DATA);
  const cancelVolumeDataRequest = useRef<Canceler>();

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
          chainId: Number(RSK_CHAIN_ID),
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
          usd: result.data?.data?.total_volume_usd || 0,
        });
      })
      .catch(() => {});
  }, []);

  useInterval(
    () => {
      fetchVolumeData();
    },
    DATA_REFRESH_INTERVAL,
    { immediate: true },
  );

  return volumeData.usd || 0;
};
