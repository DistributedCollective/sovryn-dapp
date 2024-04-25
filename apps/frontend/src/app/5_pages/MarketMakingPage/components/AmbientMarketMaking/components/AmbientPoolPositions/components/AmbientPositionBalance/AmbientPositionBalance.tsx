import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useTokenDetailsByAsset } from '../../../../../../../../../hooks/useTokenDetailsByAsset';
import { decimalic } from '../../../../../../../../../utils/math';
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
  const baseToken = useTokenDetailsByAsset(pool.base, pool.chainId);
  const quoteToken = useTokenDetailsByAsset(pool.quote, pool.chainId);
  const result = useAmbientPositionBalance(pool, position);
  if (!result) {
    return null;
  }

  return (
    <div className="inline-flex flex-col">
      <AmountRenderer
        value={decimalic(result?.positionLiqBase || '0').toUnits(
          baseToken?.decimals,
        )}
        suffix={pool.base}
      />
      <AmountRenderer
        value={decimalic(result?.positionLiqQuote || '0').toUnits(
          quoteToken?.decimals,
        )}
        suffix={pool.quote}
      />
    </div>
  );
};
