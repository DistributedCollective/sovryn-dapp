import { Decimal } from '@sovryn/utils';

export interface ILiquityBaseParams {
  minBorrowingFeeRate: Decimal;
  maxBorrowingFeeRate: Decimal;
}
