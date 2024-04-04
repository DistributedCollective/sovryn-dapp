import React, { FC } from 'react';

import { t } from 'i18next';

import { SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { translations } from '../../../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../../../utils/asset';
import { POOL_ASSET_A, POOL_ASSET_B } from '../../BobDepositModal';
import { useDepositContext } from '../../contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../hooks/useGetPoolInfo';

const pageTranslations =
  translations.bobMarketMakingPage.depositModal.newPoolStatistics;

type NewPoolStatisticsProps = {
  poolAssetA: string;
  poolAssetB: string;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({
  poolAssetA,
  poolAssetB,
}) => {
  const { firstAssetValue, secondAssetValue } = useDepositContext();
  const { price } = useGetPoolInfo(POOL_ASSET_A, POOL_ASSET_B);

  return (
    <SimpleTable className="mt-6">
      <SimpleTableRow
        label={t(pageTranslations.newPoolBalance)}
        value={<AmountRenderer value={firstAssetValue} suffix={poolAssetA} />}
        className="mb-1"
        valueClassName="text-primary-10"
      />
      <SimpleTableRow
        label=""
        value={<AmountRenderer value={secondAssetValue} suffix={poolAssetB} />}
        valueClassName="text-primary-10"
      />
      <SimpleTableRow
        label={t(pageTranslations.currentPrice, {
          token: poolAssetB.toUpperCase(),
        })}
        value={
          <AmountRenderer
            value={price}
            suffix={poolAssetB.toUpperCase()}
            precision={
              poolAssetB === COMMON_SYMBOLS.BTC
                ? BTC_RENDER_PRECISION
                : TOKEN_RENDER_PRECISION
            }
          />
        }
      />
      <SimpleTableRow
        label={t(pageTranslations.lpFeeRate)}
        value={<AmountRenderer value={0.36} suffix="%" />}
      />
    </SimpleTable>
  );
};
