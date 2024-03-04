import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../../../constants/tokens';
import { useGetPoolLiquidity } from '../../../../hooks/useGetPoolLiquidity';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';

type PoolsTableLiquidityProps = {
  pool: AmmLiquidityPool;
};

export const PoolsTableLiquidity: FC<PoolsTableLiquidityProps> = ({ pool }) => {
  const { balanceTokenA, balanceTokenB } = useGetPoolLiquidity(pool);
  return (
    <div className="flex flex-col gap-0.5">
      <AmountRenderer
        value={balanceTokenA}
        suffix={getTokenDisplayName(pool.assetA)}
        precision={TOKEN_RENDER_PRECISION}
      />
      <AmountRenderer
        value={balanceTokenB}
        suffix={BITCOIN}
        precision={BTC_RENDER_PRECISION}
      />
    </div>
  );
};
