import React, { FC, useMemo } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useDollarValue } from '../../../../../../../../../hooks/useDollarValue';
import { bigNumberic, decimalic } from '../../../../../../../../../utils/math';
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
    bigNumberic(result?.positionLiqBase || '0').toString(),
  );
  const { usdValue: quoteValue } = useDollarValue(
    pool.quote,
    bigNumberic(result?.positionLiqQuote || '0').toString(),
  );

  const value = useMemo(
    () =>
      decimalic(baseValue || 0)
        .add(quoteValue || 0)
        .toNumber(),
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
