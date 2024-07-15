import { useState, useRef, useCallback } from 'react';

import axios, { Canceler } from 'axios';

import { ChainId } from '@sovryn/ethers-provider';

import { DATA_REFRESH_INTERVAL } from '../../../../../../constants/general';
import { useChainStore } from '../../../../../../hooks/useChainStore';
import { useInterval } from '../../../../../../hooks/useInterval';
import {
  DEFAULT_LOCKED_DATA,
  DEFAULT_VOLUME_DATA,
  LOCKED_DATA_URL,
  VOLUME_DATA_URL,
} from '../ProtocolData.constants';

export const useGetData = (chainId?: ChainId) => {
  const [lockedData, setLockedData] = useState(DEFAULT_LOCKED_DATA);
  const cancelLockedDataRequest = useRef<Canceler>();
  const { currentChainId } = useChainStore();

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
          chainId: Number(chainId || currentChainId),
          stmp: Date.now(),
        },
        cancelToken,
      })
      .then(result => {
        setLockedData(result.data.data);
      })
      .catch(() => {});
  }, [chainId, currentChainId]);

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
          chainId: Number(chainId || currentChainId),
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
  }, [chainId, currentChainId]);

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
