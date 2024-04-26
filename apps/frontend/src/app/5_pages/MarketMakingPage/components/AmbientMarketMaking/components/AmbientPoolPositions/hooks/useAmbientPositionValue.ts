import { useMemo } from 'react';

import { useCurrentChain } from '../../../../../../../../hooks/useChainStore';
import { useDollarValue } from '../../../../../../../../hooks/useDollarValue';
import { bigNumberic, decimalic } from '../../../../../../../../utils/math';
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
    bigNumberic(result?.positionLiqBase || '0').toString(),
    chainId,
  );
  const { usdValue: quoteValue } = useDollarValue(
    pool.quote,
    bigNumberic(result?.positionLiqQuote || '0').toString(),
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
