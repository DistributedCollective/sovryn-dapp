import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  baseTokenForConcLiq,
  bigNumToFloat,
  floatToBigNum,
  quoteTokenForConcLiq,
  tickToPrice,
} from '@sovryn/ambient-sdk';

import { useGetPoolInfo } from '../../../../BobDepositModal/hooks/useGetPoolInfo';
import { AmbientPosition } from '../../../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../../../utils/AmbientLiquidityPool';

export const useAmbientPositionBalance = (
  pool: AmbientLiquidityPool,
  position: AmbientPosition,
) => {
  const [price, setPrice] = useState(0);
  const { pool: crocPool } = useGetPoolInfo(pool.base, pool.quote);

  const getPoolPrice = useCallback(async () => {
    if (!crocPool) {
      return;
    }

    return crocPool.spotPrice().then(result => setPrice(result));
  }, [crocPool]);

  useEffect(() => {
    if (price === 0) {
      getPoolPrice();
    }
  }, [getPoolPrice, price]);

  return useMemo(() => {
    if (!price) {
      return;
    }
    if (position.positionType === 'ambient') {
      const positionLiq = position.ambientLiq;

      return {
        positionLiq,
        positionLiqBase: positionLiq * Math.sqrt(price),
        positionLiqQuote: positionLiq / Math.sqrt(price),
      };
    } else if (position.positionType === 'concentrated') {
      const positionLiq = position.concLiq;

      const positionLiqBase = bigNumToFloat(
        baseTokenForConcLiq(
          price,
          floatToBigNum(position.concLiq),
          tickToPrice(position.bidTick),
          tickToPrice(position.askTick),
        ),
      );

      const positionLiqQuote = bigNumToFloat(
        quoteTokenForConcLiq(
          price,
          floatToBigNum(position.concLiq),
          tickToPrice(position.bidTick),
          tickToPrice(position.askTick),
        ),
      );

      return {
        positionLiq,
        positionLiqBase,
        positionLiqQuote,
      };
    }
  }, [
    position.ambientLiq,
    position.askTick,
    position.bidTick,
    position.concLiq,
    position.positionType,
    price,
  ]);
};
