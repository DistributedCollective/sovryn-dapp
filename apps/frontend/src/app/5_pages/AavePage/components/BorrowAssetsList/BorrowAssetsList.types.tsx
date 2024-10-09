import { Decimal } from '@sovryn/utils';

export type BorrowPoolDetails = {
  asset: string;
  apy: Decimal;
  available?: Decimal;
  availableUsd?: Decimal;
};
