import {
  baseTokenForConcLiq,
  bigNumToFloat,
  floatToBigNum,
  quoteTokenForConcLiq,
  tickToPrice,
} from '@sovryn/sdex';

import { PoolPositionType } from '../../../../MarketMakingPage.types';
import { AmbientPosition } from '../../AmbientMarketMaking.types';

export const getPositionBalance = (
  position: AmbientPosition,
  spotPrice: number | undefined,
) => {
  if (!spotPrice) {
    return;
  }
  if (position.positionType === PoolPositionType.ambient) {
    const positionLiq = position.ambientLiq;
    const positionLiqBase = Number(positionLiq * Math.sqrt(spotPrice)).toFixed(
      0,
    );
    const positionLiqQuote = Number(positionLiq / Math.sqrt(spotPrice)).toFixed(
      0,
    );

    return {
      positionLiq,
      positionLiqBase: Number(positionLiqBase),
      positionLiqQuote: Number(positionLiqQuote),
    };
  } else if (position.positionType === PoolPositionType.concentrated) {
    let positionLiq = position.concLiq;
    const positionLiqString = String(positionLiq);
    if (
      positionLiqString.includes('e+') ||
      positionLiqString.includes('0000')
    ) {
      positionLiq -= 1e7;
    }

    const positionLiqBase = bigNumToFloat(
      baseTokenForConcLiq(
        spotPrice,
        floatToBigNum(position.concLiq),
        tickToPrice(position.bidTick),
        tickToPrice(position.askTick),
      ),
    );

    const positionLiqQuote = bigNumToFloat(
      quoteTokenForConcLiq(
        spotPrice,
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
};
