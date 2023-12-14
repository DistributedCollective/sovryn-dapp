import { t } from 'i18next';

import { Decimal } from '@sovryn/utils';

import { TAB_ACTIVE_CLASSNAME } from '../../../../../constants/general';
import { translations } from '../../../../../locales/i18n';
import { AdjustType } from './AdjustAndDepositModal.types';

export const TABS = [
  {
    tabAction: AdjustType.Deposit,
    label: t(translations.marketMakingPage.marketMakingOperations.deposit),
    activeClassName: TAB_ACTIVE_CLASSNAME,
  },
  {
    tabAction: AdjustType.Withdraw,
    label: t(translations.marketMakingPage.marketMakingOperations.withdraw),
    activeClassName: TAB_ACTIVE_CLASSNAME,
  },
];

// We are hard-coding 5% slippage here
export const DEFAULT_AMM_SLIPPAGE = 5;

export const WEEKLY_REWARDS_AMOUNT = Decimal.from(20000);
