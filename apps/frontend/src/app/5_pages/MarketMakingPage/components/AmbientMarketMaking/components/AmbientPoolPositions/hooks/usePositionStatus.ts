import { useMemo } from 'react';

import { priceToTick } from '@sovryn/sdex';
import { Pool } from '@sovryn/sdk';

import { PoolPositionType } from '../../../../../MarketMakingPage.types';
import { useGetPoolInfo } from '../../../../BobDepositModal/hooks/useGetPoolInfo';
import { AmbientPosition } from '../../../AmbientMarketMaking.types';

export const usePositionStatus = (pool: Pool, position?: AmbientPosition) => {
  const { spotPrice: currentPrice, loading } = useGetPoolInfo(pool);

  const isAmbient = useMemo(
    () => position?.positionType === PoolPositionType.ambient,
    [position],
  );

  const currentTickPrice = useMemo(
    () => (currentPrice ? priceToTick(currentPrice) : 0),
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
    if (loading || !currentPrice || !position) {
      return null;
    }
    if (!isAmbient) {
      return rangeSpanAboveCurrentPrice < 0 || rangeSpanBelowCurrentPrice < 0;
    }
    return false;
  }, [
    loading,
    currentPrice,
    isAmbient,
    position,
    rangeSpanAboveCurrentPrice,
    rangeSpanBelowCurrentPrice,
  ]);
};
