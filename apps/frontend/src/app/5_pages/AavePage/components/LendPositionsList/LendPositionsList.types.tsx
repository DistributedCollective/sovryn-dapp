import { Decimal } from '@sovryn/utils';

export type LendPosition = {
  asset: string;
  supplied: Decimal;
  suppliedUsd: Decimal;
  apy: Decimal;
  collateral: boolean;
  canToggleCollateral: boolean;
};
