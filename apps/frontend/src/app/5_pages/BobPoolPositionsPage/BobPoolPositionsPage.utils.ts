import { tickToPrice, toDisplayPrice } from '@sovryn/sdex';

import { AmbientPosition } from '../MarketMakingPage/components/AmbientMarketMaking/AmbientMarketMaking.types';
import { getPositionBalance } from '../MarketMakingPage/components/AmbientMarketMaking/components/AmbientPoolPositions/AmbientPoolPositions.utils';
import { Position } from './BobPoolPositionsPage.types';

export const parsePoolPositions = (
  position: AmbientPosition,
  baseTokenDecimals: number,
  quoteTokenDecimals: number,
  spotPrice: number | undefined,
  baseSymbol: string,
  quoteSymbol: string,
) => {
  if (!spotPrice) {
    return;
  }

  const liquidity = getPositionBalance(position, spotPrice || 0);

  if (!liquidity) {
    return;
  }

  const lowerPriceNonDisplay = tickToPrice(position.bidTick);
  const upperPriceNonDisplay = tickToPrice(position.askTick);

  const lowerPriceDisplayInBase =
    1 /
    toDisplayPrice(upperPriceNonDisplay, baseTokenDecimals, quoteTokenDecimals);

  const upperPriceDisplayInBase =
    1 /
    toDisplayPrice(lowerPriceNonDisplay, baseTokenDecimals, quoteTokenDecimals);

  const lowerPriceDisplayInQuote = toDisplayPrice(
    lowerPriceNonDisplay,
    baseTokenDecimals,
    quoteTokenDecimals,
  );

  const upperPriceDisplayInQuote = toDisplayPrice(
    upperPriceNonDisplay,
    baseTokenDecimals,
    quoteTokenDecimals,
  );

  const result: Position = {
    positionId: position.positionId,
    wallet: position.user,
    minPriceBase: lowerPriceDisplayInBase,
    minPriceQuote: lowerPriceDisplayInQuote,
    maxPriceBase: upperPriceDisplayInBase,
    maxPriceQuote: upperPriceDisplayInQuote,
    positionLiq: liquidity?.positionLiq || 0,
    positionLiqBase: liquidity?.positionLiqBase || 0,
    positionLiqQuote: liquidity?.positionLiqQuote || 0,
    positionType: position.positionType,
    baseTokenDecimals,
    quoteTokenDecimals,
    baseTokenSymbol: baseSymbol,
    quoteTokenSymbol: quoteSymbol,
  };

  return result;
};
