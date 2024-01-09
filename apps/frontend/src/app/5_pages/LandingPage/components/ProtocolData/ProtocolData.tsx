import React, { FC, useCallback, useRef, useState } from 'react';

import axios, { Canceler } from 'axios';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
  USD,
} from '../../../../../constants/currencies';
import { useInterval } from '../../../../../hooks/useInterval';
import { getGraphWrapperUrl } from '../../../../../utils/helpers';
import { LockedDataResult, VolumeDataResult } from './ProtocolData.types';

const graphWrapper = getGraphWrapperUrl();

const lockedDataUrl = `${graphWrapper}/cmc/tvl`;
const volumeDataUrl = `${graphWrapper}/cmc/summary`;

const defaultLockedData: LockedDataResult = {
  btc: 0,
  usd: 0,
};

const defaultVolumeData: VolumeDataResult = {
  btc: 0,
  usd: 0,
};

export const ProtocolData: FC = () => {
  const [lockedDataLoading, setLockedDataLoading] = useState(false);
  const [lockedData, setLockedData] = useState(defaultLockedData);
  const cancelLockedDataRequest = useRef<Canceler>();

  const [volumeDataLoading, setVolumeDataLoading] = useState(false);
  const [volumeData, setVolumeData] = useState(defaultVolumeData);
  const cancelVolumeDataRequest = useRef<Canceler>();

  const fetchLockedData = useCallback(() => {
    setLockedDataLoading(true);
    cancelLockedDataRequest.current && cancelLockedDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelLockedDataRequest.current = c;
    });

    axios
      .get(lockedDataUrl, {
        params: {
          stmp: Date.now(),
        },
        cancelToken,
      })
      .then(result => {
        setLockedData({
          btc: result.data?.total_btc || 0,
          usd: result.data?.total_usd || 0,
        });
      })
      .finally(() => {
        setLockedDataLoading(false);
      });
  }, []);

  const fetchVolumeData = useCallback(() => {
    setVolumeDataLoading(true);
    cancelVolumeDataRequest.current && cancelVolumeDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelVolumeDataRequest.current = c;
    });

    axios
      .get(volumeDataUrl, {
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
      .finally(() => {
        setVolumeDataLoading(false);
      });
  }, []);

  useInterval(
    () => {
      fetchLockedData();
      fetchVolumeData();
    },
    600000, // 1 minute
    { immediate: true },
  );

  return (
    <div>
      <div className="text-base font-medium text-gray-10">Protocol Data</div>
      <div className="flex mt-4 font-medium">
        <div>
          <div className="text-xs  text-gray-30 mb-3">Total value locked</div>
          <div className="text-2xl text-gray-10">
            <AmountRenderer
              value={lockedDataLoading ? '0' : lockedData.btc}
              suffix={BITCOIN}
              precision={BTC_RENDER_PRECISION}
              className="block text-2xl text-gray-10"
            />
          </div>

          <div className="text-[#BEBFC2] text-sm">
            <AmountRenderer
              value={lockedData.usd}
              suffix={USD}
              precision={TOKEN_RENDER_PRECISION}
            />
          </div>
        </div>

        <div className="ml-20">
          <div className="text-xs  text-gray-30 mb-3">24 hour volume</div>
          <div className="text-2xl text-gray-10">
            <AmountRenderer
              value={volumeDataLoading ? 0 : volumeData.btc}
              suffix={BITCOIN}
              precision={BTC_RENDER_PRECISION}
              className="block text-2xl text-gray-10"
            />
          </div>

          <div className="text-[#BEBFC2] text-sm">
            <AmountRenderer
              value={volumeData.usd}
              suffix={USD}
              precision={TOKEN_RENDER_PRECISION}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
