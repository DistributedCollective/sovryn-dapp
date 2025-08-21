import { Decimal } from '@sovryn/utils';

import { DEFAULT_AMM_SLIPPAGE } from './AdjustAndDepositModal.constants';

export const getMinReturn = (amount: Decimal) =>
  amount.sub(amount.mul(DEFAULT_AMM_SLIPPAGE).div(100)).toString(0);

export const calculatePoolWeiAmount = (
  amount: Decimal,
  balance: Decimal,
  tokenPoolBalance: Decimal,
) => amount.div(balance).mul(tokenPoolBalance).toString(0);
