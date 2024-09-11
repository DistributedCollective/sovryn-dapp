import { Decimal } from '@sovryn/utils';

import { BorrowRateMode } from '../../../../../types/aave';

export type BorrowPosition = {
  asset: string;
  borrowed: Decimal;
  borrowedUsd: Decimal;
  apy: Decimal;
  variableApy: Decimal;
  stableApy: Decimal;
  stableBorrowEnabled: boolean;
  borrowRateMode: BorrowRateMode;
  isCollateral: boolean;
};
