import { Decimal } from '@sovryn/utils';

export type LendPoolDetails = {
  asset: string;
  apy: Decimal;
  canBeCollateral: boolean;
};
