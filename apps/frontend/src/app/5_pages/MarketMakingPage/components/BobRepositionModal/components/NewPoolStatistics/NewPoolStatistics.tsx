import React, { FC } from 'react';

import { t } from 'i18next';

import { SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { AmbientLiquidityPool } from '../../../AmbientMarketMaking/utils/AmbientLiquidityPool';

const pageTranslations =
  translations.bobMarketMakingPage.repositionModal.newPoolStatistics;

type NewPoolStatisticsProps = {
  baseAmount: string;
  quoteAmount: string;
  pool: AmbientLiquidityPool;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({
  baseAmount,
  quoteAmount,
  pool,
}) => (
  <SimpleTable className="mt-6">
    <SimpleTableRow
      label={t(pageTranslations.newPoolBalance)}
      value={<AmountRenderer value={baseAmount} suffix={pool.base} />}
      className="mb-1"
      valueClassName="text-primary-10"
    />
    <SimpleTableRow
      label=""
      value={<AmountRenderer value={quoteAmount} suffix={pool.quote} />}
      valueClassName="text-primary-10"
    />
  </SimpleTable>
);
