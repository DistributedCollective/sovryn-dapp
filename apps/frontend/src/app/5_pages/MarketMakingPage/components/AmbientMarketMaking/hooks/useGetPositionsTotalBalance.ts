import { useMemo } from 'react';

import { getPositionBalance } from '../components/AmbientPoolPositions/AmbientPoolPositions.utils';
import { usePoolSpotPrice } from '../components/AmbientPoolPositions/hooks/usePoolSpotPrice';
import { AmbientLiquidityPool } from '../utils/AmbientLiquidityPool';
import { useGetAmbientPositions } from './useGetAmbientPositions';

export const useGetPositionsTotalBalance = (pool: AmbientLiquidityPool) => {
  const { positions } = useGetAmbientPositions(pool);
  const { value: price } = usePoolSpotPrice(pool.base, pool.quote);

  return useMemo(() => {
    if (!price) {
      return 0;
    }
    const balances = positions
      .map(position => getPositionBalance(position, price))
      .filter(balance => !!balance);

    const sum = {
      positionLiq: 0,
      positionLiqBase: 0,
      positionLiqQuote: 0,
    };
    balances.forEach(balance => {
      sum.positionLiq += Number(balance?.positionLiq) || 0;
      sum.positionLiqBase += balance?.positionLiqBase || 0;
      sum.positionLiqQuote += balance?.positionLiqQuote || 0;
    });

    return sum;
  }, [positions, price]);
};
