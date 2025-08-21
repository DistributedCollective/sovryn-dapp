import { PoolPositionType } from '../../MarketMakingPage.types';

export const mintArgsForReposition = (
  lowTick: number,
  highTick: number,
  rangeWidth: number,
): PoolPositionType.ambient | [number, number] => {
  if (rangeWidth === 100) {
    return PoolPositionType.ambient;
  } else {
    return [lowTick, highTick];
  }
};
