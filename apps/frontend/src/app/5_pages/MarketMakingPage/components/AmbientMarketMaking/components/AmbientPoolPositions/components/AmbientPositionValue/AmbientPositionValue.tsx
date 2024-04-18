import React, { FC, useMemo } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useDollarValue } from '../../../../../../../../../hooks/useDollarValue';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';
import { useAmbientPositionBalance } from '../../hooks/useAmbientPositionBalance';

type AmbientPositionValueProps = {
  pool: AmbientLiquidityPool;
  position: AmbientPosition;
};

export const AmbientPositionValue: FC<AmbientPositionValueProps> = ({
  position,
  pool,
}) => {
  const result = useAmbientPositionBalance(pool, position);

  const { usdValue: baseValue } = useDollarValue(
    pool.base,
    String(result?.positionLiqBase || '0'),
  );
  const { usdValue: quoteValue } = useDollarValue(
    pool.quote,
    String(result?.positionLiqQuote || '0'),
  );

  const value = useMemo(
    () => Number(baseValue || 0) + Number(quoteValue || 0),
    [baseValue, quoteValue],
  );

  if (!result) {
    return null;
  }

  return (
    <div className="inline-flex flex-col">
      <AmountRenderer value={value} />
    </div>
  );
};
