import { useMemo } from 'react';

import { useCurrentChain } from '../../../../../../../../hooks/useChainStore';
import { useDollarValue } from '../../../../../../../../hooks/useDollarValue';
import { findAsset } from '../../../../../../../../utils/asset';
import {
  bigNumberic,
  decimalic,
  toWei,
} from '../../../../../../../../utils/math';
import { AmbientPosition } from '../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../utils/AmbientLiquidityPool';
import { useAmbientPositionBalance } from './useAmbientPositionBalance';

export const useAmbientPositionValue = (
  pool: AmbientLiquidityPool,
  position: AmbientPosition,
) => {
  const chainId = useCurrentChain();
  const result = useAmbientPositionBalance(pool, position);

  const { usdValue: baseValue } = useDollarValue(
    pool.base,
    toWei(
      bigNumberic(result?.positionLiqBase || '0'),
      18 - findAsset(pool.base, chainId).decimals,
    ).toString(),
    chainId,
  );
  const { usdValue: quoteValue } = useDollarValue(
    pool.quote,
    toWei(
      bigNumberic(result?.positionLiqQuote || '0'),
      18 - findAsset(pool.quote, chainId).decimals,
    ).toString(),
    chainId,
  );

  const value = useMemo(
    () =>
      result
        ? decimalic(baseValue || 0)
            .add(quoteValue || 0)
            .toNumber()
        : null,
    [baseValue, quoteValue, result],
  );

  return value;
};
