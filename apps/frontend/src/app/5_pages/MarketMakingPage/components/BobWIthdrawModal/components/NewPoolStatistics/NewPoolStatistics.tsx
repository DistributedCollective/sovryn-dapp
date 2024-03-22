import React, { FC } from 'react';

import { t } from 'i18next';

import { SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../../constants/currencies';
import { translations } from '../../../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';

const pageTranslations =
  translations.bobMarketMakingPage.withdrawModal.newPoolStatistics;

type NewPoolStatisticsProps = {
  pool: AmmLiquidityPool;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({ pool }) => {
  return (
    <SimpleTable className="mt-6">
      <SimpleTableRow
        label={t(pageTranslations.newPoolBalance)}
        value={<AmountRenderer value={700} suffix={pool.assetA} />}
        className="mb-1"
        valueClassName="text-primary-10"
      />
      <SimpleTableRow
        label=""
        value={<AmountRenderer value={0.026} suffix={pool.assetB} />}
        valueClassName="text-primary-10"
      />
      <SimpleTableRow
        label={t(pageTranslations.earnedRewards)}
        value={
          <AmountRenderer
            value={1234.567}
            suffix="BoB"
            precision={TOKEN_RENDER_PRECISION}
          />
        }
      />
      <SimpleTableRow
        label={t(pageTranslations.slippage)}
        value={<AmountRenderer value={1.25} suffix="%" />}
      />
    </SimpleTable>
  );
};
