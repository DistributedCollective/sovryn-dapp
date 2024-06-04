import { useMemo } from 'react';

import { priceToTick } from '@sovryn/sdex';

import { useGetPoolInfo } from '../../../../BobDepositModal/hooks/useGetPoolInfo';
import { AmbientPosition } from '../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../utils/AmbientLiquidityPool';

export const usePositionStatus = (
  pool: AmbientLiquidityPool,
  position?: AmbientPosition,
  isDeposit?: boolean,
) => {
  const { spotPrice: currentPrice } = useGetPoolInfo(pool.base, pool.quote);

  const currentTickPrice = useMemo(
    () => priceToTick(currentPrice),
    [currentPrice],
  );

  const rangeSpanAboveCurrentPrice = useMemo(() => {
    if (!position) {
      return 0;
    }
    return position.askTick - currentTickPrice;
  }, [currentTickPrice, position]);

  const rangeSpanBelowCurrentPrice = useMemo(() => {
    if (!position) {
      return 0;
    }
    return currentTickPrice - position.bidTick;
  }, [currentTickPrice, position]);

  return useMemo(() => {
    if (position) {
      return rangeSpanAboveCurrentPrice < 0 || rangeSpanBelowCurrentPrice < 0;
    }
    return isDeposit;
  }, [
    isDeposit,
    position,
    rangeSpanAboveCurrentPrice,
    rangeSpanBelowCurrentPrice,
  ]);
};
