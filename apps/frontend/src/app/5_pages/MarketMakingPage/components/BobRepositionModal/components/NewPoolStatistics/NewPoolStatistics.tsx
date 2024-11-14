import React, { FC } from 'react';

import { t } from 'i18next';

import { Pool } from '@sovryn/sdk';
import { SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../locales/i18n';

const pageTranslations =
  translations.bobMarketMakingPage.repositionModal.newPoolStatistics;

type NewPoolStatisticsProps = {
  baseAmount: string;
  quoteAmount: string;
  pool: Pool;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({
  baseAmount,
  quoteAmount,
  pool,
}) => (
  <SimpleTable className="mt-6">
    <SimpleTableRow
      label={t(pageTranslations.newPoolBalance)}
      value={<AmountRenderer value={baseAmount} suffix={pool.base.symbol} />}
      className="mb-1"
      valueClassName="text-primary-10"
    />
    <SimpleTableRow
      label=""
      value={<AmountRenderer value={quoteAmount} suffix={pool.quote.symbol} />}
      valueClassName="text-primary-10"
    />
  </SimpleTable>
);
