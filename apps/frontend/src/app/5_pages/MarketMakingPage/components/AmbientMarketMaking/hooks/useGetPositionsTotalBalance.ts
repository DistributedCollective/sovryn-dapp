import { useMemo } from 'react';

import { fromDisplayPrice } from '@sovryn/sdex';
import { Pool } from '@sovryn/sdk';

import { getPositionBalance } from '../components/AmbientPoolPositions/AmbientPoolPositions.utils';
import { useGetAmbientPositions } from './useGetAmbientPositions';

export const useGetPositionsTotalBalance = (pool: Pool) => {
  const { positions } = useGetAmbientPositions(pool);
  const price = fromDisplayPrice(
    Number(pool.price),
    pool.base.decimals,
    pool.quote.decimals,
    true,
  );

  return useMemo(() => {
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
  }, [price, positions]);
};
