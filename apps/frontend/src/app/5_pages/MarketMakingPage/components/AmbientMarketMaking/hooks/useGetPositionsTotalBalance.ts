import { useMemo } from 'react';

import { Pool } from '@sovryn/sdk';

import { getPositionBalance } from '../components/AmbientPoolPositions/AmbientPoolPositions.utils';
import { usePoolSpotPrice } from '../components/AmbientPoolPositions/hooks/usePoolSpotPrice';
import { useGetAmbientPositions } from './useGetAmbientPositions';

export const useGetPositionsTotalBalance = (pool: Pool) => {
  const { positions } = useGetAmbientPositions(pool);
  const { value: price } = usePoolSpotPrice(pool);

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
