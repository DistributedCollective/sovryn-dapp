import { PoolPositionType } from '../../MarketMakingPage.types';

export const mintArgsForReposition = (
  lowTick: number,
  highTick: number,
): PoolPositionType.ambient | [number, number] => {
  if (lowTick === 0 && highTick === 0) {
    return PoolPositionType.ambient;
  } else {
    return [lowTick, highTick];
  }
};
