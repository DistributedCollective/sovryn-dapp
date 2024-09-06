import { Decimal } from '@sovryn/utils';

export type LendPosition = {
  asset: string;
  supplied: Decimal;
  suppliedUSD: Decimal;
  apy: Decimal;
  collateral: boolean;
};
