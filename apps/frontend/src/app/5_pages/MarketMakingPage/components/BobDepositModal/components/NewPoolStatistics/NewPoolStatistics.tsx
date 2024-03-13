import React, { FC } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { SimpleTable, SimpleTableRow } from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';

type NewPoolStatisticsProps = {
  pool: AmmLiquidityPool;
};

export const NewPoolStatistics: FC<NewPoolStatisticsProps> = ({ pool }) => {
  return (
    <SimpleTable className="mt-6">
      <SimpleTableRow
        label="New pool balance"
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
        label={`Current ${pool.assetB.toUpperCase()} price`}
        value={
          <AmountRenderer
            value={51456.245605939}
            suffix={pool.assetB.toUpperCase()}
            precision={
              pool.assetB === SupportedTokens.rbtc
                ? BTC_RENDER_PRECISION
                : TOKEN_RENDER_PRECISION
            }
          />
        }
      />
      <SimpleTableRow
        label="LP fee rate"
        value={<AmountRenderer value={0.36} suffix="%" />}
      />
    </SimpleTable>
  );
};
