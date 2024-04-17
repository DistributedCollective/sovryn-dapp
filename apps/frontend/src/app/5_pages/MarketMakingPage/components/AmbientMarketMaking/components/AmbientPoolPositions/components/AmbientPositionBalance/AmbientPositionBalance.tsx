import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useCurrentChain } from '../../../../../../../../../hooks/useChainStore';
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
  const chainId = useCurrentChain();
  const baseToken = useTokenDetailsByAsset(pool.base, chainId);
  const quoteToken = useTokenDetailsByAsset(pool.quote, chainId);
  const result = useAmbientPositionBalance(pool, position);
  if (!result) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <AmountRenderer
        value={decimalic(result?.positionLiqBase || '0').div(
          Math.pow(10, (baseToken?.decimals || 0) + 3),
        )}
        suffix={pool.base}
      />
      <AmountRenderer
        value={decimalic(result?.positionLiqQuote || '0').div(
          Math.pow(10, (quoteToken?.decimals || 0) + 3),
        )}
        suffix={pool.quote}
      />
    </div>
  );
};
