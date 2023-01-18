import type { Fees } from '@sovryn-zero/lib-base';

import { SupportedTokenList, SupportedTokens } from '@sovryn/contracts';
import type { SelectOption } from '@sovryn/ui';

import { BORROW_ASSETS } from '../../5_pages/ZeroPage/constants';

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

export const tokens: SelectOption<SupportedTokens>[] =
  SupportedTokenList.filter(item => BORROW_ASSETS.includes(item.symbol)).map(
    token => ({
      value: token.symbol,
      label: token.symbol.toUpperCase(),
    }),
  );
