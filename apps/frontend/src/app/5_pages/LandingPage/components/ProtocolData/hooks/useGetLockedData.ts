import { useState, useRef, useCallback } from 'react';

import axios, { Canceler } from 'axios';

import { ChainId } from '@sovryn/ethers-provider';

import { DATA_REFRESH_INTERVAL } from '../../../../../../constants/general';
import { useChainStore } from '../../../../../../hooks/useChainStore';
import { useInterval } from '../../../../../../hooks/useInterval';
import {
  DEFAULT_LOCKED_DATA,
  LOCKED_DATA_URL,
} from '../ProtocolData.constants';

export const useGetLockedData = (chainId?: ChainId) => {
  const [lockedData, setLockedData] = useState(DEFAULT_LOCKED_DATA);
  const cancelLockedDataRequest = useRef<Canceler>();
  const { currentChainId } = useChainStore();

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
        if (result.data.data) {
          setLockedData(result.data.data);
        }
      })
      .catch(() => {});
  }, [chainId, currentChainId]);

  useInterval(
    () => {
      fetchLockedData();
    },
    DATA_REFRESH_INTERVAL,
    { immediate: true },
  );

  return lockedData;
};
