import { SupportedTokens } from '@sovryn/contracts';

export enum AmountType {
  Add = 'Add',
  Remove = 'Remove',
}

export type CreditLineSubmitValue = {
  token: SupportedTokens;
  borrow: string;
  repay: string;
  depositCollateral: string;
  withdrawCollateral: string;
  maxOriginationFeeRate: string;
};
