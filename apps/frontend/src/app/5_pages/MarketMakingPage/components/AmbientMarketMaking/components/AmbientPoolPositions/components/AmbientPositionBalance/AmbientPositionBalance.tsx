import React, { FC } from 'react';

import { Pool } from '@sovryn/sdk';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { decimalic } from '../../../../../../../../../utils/math';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { useAmbientPositionBalance } from '../../hooks/useAmbientPositionBalance';

type AmbientPositionBalanceProps = {
  pool: Pool;
  position: AmbientPosition;
  priceOverride?: number;
};

export const AmbientPositionBalance: FC<AmbientPositionBalanceProps> = ({
  position,
  pool,
  priceOverride,
}) => {
  const result = useAmbientPositionBalance(pool, position, priceOverride);
  if (!result) {
    return null;
  }

  return (
    <div className="inline-flex flex-col">
      <AmountRenderer
        value={decimalic(result?.positionLiqBase || '0').toUnits(
          pool.base.decimals,
        )}
        suffix={pool.base.symbol}
      />
      <AmountRenderer
        value={decimalic(result?.positionLiqQuote || '0').toUnits(
          pool.quote.decimals,
        )}
        suffix={pool.quote.symbol}
      />
    </div>
  );
};
