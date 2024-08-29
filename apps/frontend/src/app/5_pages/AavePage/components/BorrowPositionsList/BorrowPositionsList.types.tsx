import { Decimal } from '@sovryn/utils';

import { BorrowRateMode } from '../../../../../types/aave';

export type BorrowPosition = {
  asset: string;
  borrowed: Decimal;
  borrowedUSD: Decimal;
  apy: Decimal;
  type: BorrowRateMode;
};
