import { Decimal } from '@sovryn/utils';

export type PositionValues = {
  [key: string]: {
    poolId: string;
    value: Decimal;
  };
};
