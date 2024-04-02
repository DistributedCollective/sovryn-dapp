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
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';

const pageTranslations =
  translations.bobMarketMakingPage.depositModal.newPoolStatistics;

type NewPoolStatisticsProps = {
  pool: AmmLiquidityPool;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({ pool }) => {
  return (
    <SimpleTable className="mt-6">
      <SimpleTableRow
        label={t(pageTranslations.newPoolBalance)}
        value={<AmountRenderer value={1700} suffix={pool.assetA} />}
        className="mb-1"
        valueClassName="text-primary-10"
      />
      <SimpleTableRow
        label=""
        value={<AmountRenderer value={0.0603} suffix={pool.assetB} />}
        valueClassName="text-primary-10"
      />
      <SimpleTableRow
        label={t(pageTranslations.currentPrice, {
          token: pool.assetB.toUpperCase(),
        })}
        value={
          <AmountRenderer
            value={51456.245605939}
            suffix={pool.assetB.toUpperCase()}
            precision={
              pool.assetB === COMMON_SYMBOLS.BTC
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
