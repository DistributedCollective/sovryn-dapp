import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';
import { useAmbientPositionValue } from '../../hooks/useAmbientPositionValue';

type AmbientPositionValueProps = {
  pool: AmbientLiquidityPool;
  position: AmbientPosition;
};

export const AmbientPositionValue: FC<AmbientPositionValueProps> = ({
  position,
  pool,
}) => {
  const value = useAmbientPositionValue(pool, position);

  if (value == null) {
    return null;
  }

  return (
    <div className="inline-flex flex-col">
      <AmountRenderer value={value} />
    </div>
  );
};
