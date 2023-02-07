import type { Fees } from '@sovryn-zero/lib-base';

import { SupportedTokens } from '@sovryn/contracts';

export enum AmountType {
  Add = 'Add',
  Remove = 'Remove',
}

export enum CreditLineType {
  Open,
  Adjust,
}

export type CreditLineSubmitValue = {
  token: SupportedTokens;
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

export enum TroveErrorLevel {
  Warning = 'Warning',
  Critical = 'Critical',
}

export type TroveError = {
  level: TroveErrorLevel;
  message: string;
};
