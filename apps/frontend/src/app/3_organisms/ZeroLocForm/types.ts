import type { Fees } from '@sovryn-zero/lib-base';

export enum AmountType {
  Add = 'Add',
  Remove = 'Remove',
}

export enum CreditLineType {
  Open,
  Adjust,
}

export type CreditLineSubmitValue = {
  borrow: string;
  repay: string;
  depositCollateral: string;
  withdrawCollateral: string;
};

export type AdjustCreditLineProps = {
  type: CreditLineType;
  existingCollateral: string;
  existingDebt: string;
  onSubmit: (value: CreditLineSubmitValue) => void;
  rbtcPrice?: string;
  fees?: Fees;
};
