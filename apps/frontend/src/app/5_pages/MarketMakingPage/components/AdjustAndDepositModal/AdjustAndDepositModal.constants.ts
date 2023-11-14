import { t } from 'i18next';

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
