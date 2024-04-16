import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';
import { useAmbientPositionBalance } from '../../hooks/useAmbientPositionBalance';

type AmbientPositionBalanceProps = {
  pool: AmbientLiquidityPool;
  position: AmbientPosition;
};

export const AmbientPositionBalance: FC<AmbientPositionBalanceProps> = ({
  position,
  pool,
}) => {
  const result = useAmbientPositionBalance(pool, position);
  console.log({ result, position });
  return (
    <div className="flex flex-col">
      <AmountRenderer value="1" suffix={pool.base} />
      <AmountRenderer value="0" suffix={pool.quote} />
    </div>
  );
};
