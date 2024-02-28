import React, { FC, useCallback } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BITCOIN, USD } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import {
  BTC_VALUE_PRECISION,
  USD_VALUE_PRECISION,
} from './ProtocolData.constants';
import { useGetData } from './hooks/useGetData';

const pageTranslations = translations.landingPage.protocolDataSection;

export const ProtocolData: FC = () => {
  const { lockedData, volumeData } = useGetData();
  const navigate = useNavigate();

  const handleClick = useCallback(() => navigate('/stats'), [navigate]);

  return (
    <div>
      <div className="text-base font-medium text-gray-10">
        <div className="sm:justify-start justify-between flex items-baseline">
          {t(pageTranslations.title)}
          <Button
            text={t(pageTranslations.cta)}
            style={ButtonStyle.ghost}
            onClick={handleClick}
            dataAttribute="protocol-data-view-button"
            className="ml-3"
          />
        </div>
      </div>
      <div className="flex mt-6 font-medium">
        <div>
          <div className="text-xs  text-gray-30 mb-3">
            {t(pageTranslations.totalValueLocked)}
          </div>
          <div className="sm:text-2xl text-gray-10 text-sm sm:font-medium font-semibold">
            <AmountRenderer
              value={lockedData.total_btc}
              suffix={BITCOIN}
              precision={BTC_VALUE_PRECISION}
            />
          </div>

          <div className="text-[#BEBFC2] text-sm">
            <AmountRenderer
              value={lockedData.total_usd}
              suffix={USD}
              precision={USD_VALUE_PRECISION}
            />
          </div>
        </div>

        <div className="sm:ml-20 ml-10">
          <div className="text-xs  text-gray-30 mb-3">
            {t(pageTranslations.volume)}
          </div>
          <div className="sm:text-2xl text-gray-10 text-sm sm:font-medium font-semibold">
            <AmountRenderer
              value={volumeData.btc}
              suffix={BITCOIN}
              precision={BTC_VALUE_PRECISION}
            />
          </div>

          <div className="text-[#BEBFC2] text-sm">
            <AmountRenderer
              value={volumeData.usd}
              suffix={USD}
              precision={USD_VALUE_PRECISION}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
