import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useCurrentChain } from '../../../../../../../../../hooks/useChainStore';
import { useTokenDetailsByAsset } from '../../../../../../../../../hooks/useTokenDetailsByAsset';
import { decimalic, fromWei } from '../../../../../../../../../utils/math';
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
        value={fromWei(
          decimalic(result?.positionLiqBase || '0').toString(),
          baseToken?.decimals,
        )}
        suffix={pool.base}
      />
      <AmountRenderer
        value={fromWei(
          decimalic(result?.positionLiqQuote || '0').toString(),
          quoteToken?.decimals,
        )}
        suffix={pool.quote}
      />
    </div>
  );
};
