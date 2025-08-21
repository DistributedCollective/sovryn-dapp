import React, { FC } from 'react';

import { t } from 'i18next';

import { Pool } from '@sovryn/sdk';
import { SimpleTable, SimpleTableRow } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { AmbientPosition } from '../../../AmbientMarketMaking/AmbientMarketMaking.types';
import { AmbientPositionStatus } from '../../../AmbientMarketMaking/components/AmbientPoolPositions/components/AmbientPositionStatus/AmbientPositionStatus';
import { DEFAULT_SLIPPAGE } from '../../../BobDepositModal/BobDepositModal.constants';

const pageTranslations =
  translations.bobMarketMakingPage.withdrawModal.newPoolStatistics;

type NewPoolStatisticsProps = {
  baseAmount: Decimal;
  quoteAmount: Decimal;
  pool: Pool;
  position: AmbientPosition;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({
  baseAmount,
  quoteAmount,
  pool,
  position,
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
    <SimpleTableRow
      label={t(pageTranslations.status)}
      value={
        <AmbientPositionStatus
          position={position}
          pool={pool}
          className="flex justify-end"
        />
      }
      valueClassName="text-primary-10"
    />
    <SimpleTableRow
      label={t(pageTranslations.slippage)}
      value={<AmountRenderer value={DEFAULT_SLIPPAGE} suffix="%" />}
    />
  </SimpleTable>
);
