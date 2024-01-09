import React, { FC, useCallback, useRef, useState } from 'react';

import axios, { Canceler } from 'axios';
import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
  USD,
} from '../../../../../constants/currencies';
import { useInterval } from '../../../../../hooks/useInterval';
import { translations } from '../../../../../locales/i18n';
import {
  DATA_REFRESH_INTERVAL,
  DEFAULT_LOCKED_DATA,
  DEFAULT_VOLUME_DATA,
  LOCKED_DATA_URL,
  VOLUME_DATA_URL,
} from './ProtocolData.constants';

const pageTranslations = translations.landingPage.protocolDataSection;

export const ProtocolData: FC = () => {
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
        setLockedData({
          btc: result.data?.total_btc || 0,
          usd: result.data?.total_usd || 0,
        });
      });
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
      });
  }, []);

  useInterval(
    () => {
      fetchLockedData();
      fetchVolumeData();
    },
    DATA_REFRESH_INTERVAL,
    { immediate: true },
  );

  return (
    <div>
      <div className="text-base font-medium text-gray-10">
        {t(pageTranslations.title)}
        <Button
          text={t(pageTranslations.cta)}
          href="" // TODO: This page does not exist yet, add link here once it's implemented
          style={ButtonStyle.ghost}
          className="text-sm font-medium ml-4"
        />
      </div>
      <div className="flex mt-4 font-medium">
        <div>
          <div className="text-xs  text-gray-30 mb-3">
            {t(pageTranslations.totalValueLocked)}
          </div>
          <div className="text-2xl text-gray-10">
            <AmountRenderer
              value={lockedData.btc}
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
          <div className="text-xs  text-gray-30 mb-3">
            {t(pageTranslations.volume)}
          </div>
          <div className="text-2xl text-gray-10">
            <AmountRenderer
              value={volumeData.btc}
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
