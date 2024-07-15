import React, { FC, useCallback, useMemo, useReducer } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Accordion, Button, ButtonStyle, Paragraph } from '@sovryn/ui';

import { BOB_CHAIN_ID, RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { NativeTokenAmount } from '../../../../2_molecules/NativeTokenAmount/NativeTokenAmount';
import { USD } from '../../../../../constants/currencies';
import { translations } from '../../../../../locales/i18n';
import { USD_VALUE_PRECISION } from './ProtocolData.constants';
import styles from './ProtocolData.module.css';
import { useGetData } from './hooks/useGetData';

const pageTranslations = translations.landingPage.protocolDataSection;

export const ProtocolData: FC = () => {
  const { lockedData, volumeData } = useGetData(RSK_CHAIN_ID);
  const { lockedData: bobLockedData, volumeData: bobVolumeData } =
    useGetData(BOB_CHAIN_ID);
  const navigate = useNavigate();
  const [open, toggle] = useReducer(v => !v, false);

  const handleClick = useCallback(() => navigate('/stats'), [navigate]);

  const total = useMemo(() => {
    return {
      lockedData:
        Number(lockedData.total_usd || '0') +
        Number(bobLockedData.total_usd || '0'),
      volumeData:
        Number(volumeData.usd || '0') + Number(bobVolumeData.usd || '0'),
    };
  }, [
    bobLockedData.total_usd,
    bobVolumeData.usd,
    lockedData.total_usd,
    volumeData.usd,
  ]);

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

      <Accordion
        label={
          <div className="flex justify-between font-medium w-full">
            <div className="flex flex-col items-start sm:min-w-44">
              <div className="text-xs text-gray-30 mb-2">
                {t(pageTranslations.totalValueLockedAllNetworks)}
              </div>
              <div className="sm:text-2xl text-gray-10 text-sm sm:font-medium font-semibold leading-8">
                <NativeTokenAmount usdValue={total.lockedData} />
              </div>

              <div className="text-gray-50 text-sm">
                <AmountRenderer
                  value={total.lockedData}
                  suffix={USD}
                  precision={USD_VALUE_PRECISION}
                />
              </div>
            </div>

            <div className="ml-10 mr-5 flex flex-col items-start sm:min-w-44">
              <div className="text-xs text-gray-30 mb-2">
                {t(pageTranslations.volumeAllNetworks)}
              </div>
              <div className="sm:text-2xl text-gray-10 text-sm sm:font-medium font-semibold leading-8">
                <NativeTokenAmount usdValue={volumeData.usd} />
              </div>

              <div className="text-gray-50 text-sm">
                <AmountRenderer
                  value={volumeData.usd}
                  suffix={USD}
                  precision={USD_VALUE_PRECISION}
                />
              </div>
            </div>
          </div>
        }
        children={
          <div className="lg:p-4 px-0 py-4 font-medium">
            <div className="flex justify-between w-full">
              <div className="flex flex-col items-start sm:min-w-44">
                <div className="text-xs text-gray-30 mb-2">
                  {t(pageTranslations.tvlRskNetwork)}
                </div>
                <div className="text-gray-10 text-sm sm:font-medium font-semibold">
                  <NativeTokenAmount usdValue={lockedData.total_usd} />
                </div>

                <div className="text-gray-50 text-sm">
                  <AmountRenderer
                    value={lockedData.total_usd}
                    suffix={USD}
                    precision={USD_VALUE_PRECISION}
                  />
                </div>
              </div>

              <div className="ml-10 mr-5 flex flex-col sm:min-w-44">
                <div className="text-xs text-gray-30 mb-2">
                  {t(pageTranslations.volumeRskNetwork)}
                </div>
                <div className="text-gray-10 text-sm sm:font-medium font-semibold">
                  <NativeTokenAmount usdValue={volumeData.usd} />
                </div>

                <div className="text-gray-50 text-sm">
                  <AmountRenderer
                    value={volumeData.usd}
                    suffix={USD}
                    precision={USD_VALUE_PRECISION}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between w-full mt-4">
              <div className="flex flex-col sm:min-w-44">
                <div className="text-xs text-gray-30 mb-2">
                  {t(pageTranslations.tvlBobNetwork)}
                </div>
                <div className="text-gray-10 text-sm italic">
                  <NativeTokenAmount usdValue={bobLockedData.total_usd} />
                </div>
                <div className="text-gray-50 text-sm">
                  <AmountRenderer
                    value={bobLockedData.total_usd}
                    suffix={USD}
                    precision={USD_VALUE_PRECISION}
                  />
                </div>
              </div>

              <div className="ml-10 mr-5 flex flex-col items-start sm:min-w-44">
                <div className="text-xs text-gray-30 mb-2">
                  {t(pageTranslations.volumeBobNetwork)}
                </div>
                <div className="text-gray-10 text-sm italic">
                  <Paragraph children={t(pageTranslations.dataComingSoon)} />
                </div>
              </div>
            </div>
          </div>
        }
        dataAttribute="protocol-data-accordion"
        open={open}
        onClick={toggle}
        className={styles.accordion}
      />
    </div>
  );
};
