import {
  baseTokenForConcLiq,
  bigNumToFloat,
  floatToBigNum,
  quoteTokenForConcLiq,
  tickToPrice,
} from '@sovryn/sdex';

import { AmbientPosition } from '../../AmbientMarketMaking.types';

export const getPositionBalance = (
  position: AmbientPosition,
  spotPrice: number | undefined,
) => {
  if (!spotPrice) {
    return;
  }
  if (position.positionType === 'ambient') {
    const positionLiq = position.ambientLiq;

    return {
      positionLiq,
      positionLiqBase: positionLiq * Math.sqrt(spotPrice),
      positionLiqQuote: positionLiq / Math.sqrt(spotPrice),
    };
  } else if (position.positionType === 'concentrated') {
    const positionLiq = position.concLiq;

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
