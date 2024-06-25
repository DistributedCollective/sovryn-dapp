import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../../../../../constants/tokens';
import { decimalic } from '../../../../../../../../../utils/math';
import { useGetAmbientPoolStats } from '../../../../hooks/useGetAmbientPoolStats';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type AmbientPoolLiquidityProps = {
  pool: AmbientLiquidityPool;
};

export const AmbientPoolLiquidity: FC<AmbientPoolLiquidityProps> = ({
  pool,
}) => {
  const { stats, baseToken, quoteToken } = useGetAmbientPoolStats(pool);

  return (
    <div className="inline-flex flex-col gap-0.5">
      <AmountRenderer
        value={decimalic(stats?.baseTvl || 0).toUnits(baseToken?.decimals)}
        suffix={getTokenDisplayName(pool.base, pool.chainId)}
        precision={TOKEN_RENDER_PRECISION}
      />
      <AmountRenderer
        value={decimalic(stats?.quoteTvl || 0).toUnits(quoteToken?.decimals)}
        suffix={getTokenDisplayName(pool.quote, pool.chainId)}
        precision={TOKEN_RENDER_PRECISION}
      />
    </div>
  );
};
