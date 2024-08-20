import { Decimal } from '@sovryn/utils';
import { ApyType } from '../../../../../utils/aave';

export type BorrowPosition = {
  asset: string;
  borrowed: Decimal;
  borrowedUSD: Decimal;
  apy: Decimal;
  apyType: ApyType;
};
