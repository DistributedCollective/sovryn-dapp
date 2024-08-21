import { Decimal } from '@sovryn/utils';
import { ApyType } from '../../../../../utils/aave/AaveUserReservesSummary';

export type BorrowPosition = {
  asset: string;
  borrowed: Decimal;
  borrowedUSD: Decimal;
  apy: Decimal;
  apyType: ApyType;
};
