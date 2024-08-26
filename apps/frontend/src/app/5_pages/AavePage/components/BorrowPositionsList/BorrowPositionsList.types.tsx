import { Decimal } from '@sovryn/utils';

import { LoanType } from '../../../../../utils/aave/AaveUserReservesSummary';

export type BorrowPosition = {
  asset: string;
  borrowed: Decimal;
  borrowedUSD: Decimal;
  apy: Decimal;
  type: LoanType;
};
