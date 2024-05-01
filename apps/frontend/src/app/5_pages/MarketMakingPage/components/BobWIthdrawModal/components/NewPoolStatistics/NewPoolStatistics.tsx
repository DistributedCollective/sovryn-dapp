import React, { FC } from 'react';

import { t } from 'i18next';

import { SimpleTable, SimpleTableRow } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../locales/i18n';
import { AmbientLiquidityPool } from '../../../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { DEFAULT_SLIPPAGE } from '../../../BobDepositModal/BobDepositModal.constants';

const pageTranslations =
  translations.bobMarketMakingPage.withdrawModal.newPoolStatistics;

type NewPoolStatisticsProps = {
  baseAmount: Decimal;
  quoteAmount: Decimal;
  pool: AmbientLiquidityPool;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({
  baseAmount,
  quoteAmount,
  pool,
}) => {
  return (
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
      {/* <SimpleTableRow
        label={t(pageTranslations.earnedRewards)}
        value={
          <AmountRenderer
            value={1234.567}
            suffix="BoB"
            precision={TOKEN_RENDER_PRECISION}
          />
        }
      /> */}
      <SimpleTableRow
        label={t(pageTranslations.slippage)}
        value={<AmountRenderer value={DEFAULT_SLIPPAGE} suffix="%" />}
      />
    </SimpleTable>
  );
};
