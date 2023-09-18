import { t } from 'i18next';

import { translations } from '../../../../../locales/i18n';
import { CollateralTabAction, DebtTabAction } from './AdjustLoanForm.types';

export const SECONDS_IN_YEAR = 31536000;
export const INTEREST_DURATION = 3600;

export const ACTIVE_CLASSNAME = 'bg-gray-70 text-primary-20';

export const DEBT_TABS = [
  // {
  //   tabAction: DebtTabAction.Borrow,
  //   label: t(translations.fixedInterestPage.adjustLoanDialog.actions.borrow),
  //   activeClassName: ACTIVE_CLASSNAME,
  // },
  {
    tabAction: DebtTabAction.Repay,
    label: t(translations.fixedInterestPage.adjustLoanDialog.actions.repay),
    activeClassName: ACTIVE_CLASSNAME,
  },
  {
    tabAction: DebtTabAction.Close,
    label: t(translations.fixedInterestPage.adjustLoanDialog.actions.close),
    activeClassName: ACTIVE_CLASSNAME,
  },
];

export const COLLATERAL_TABS = [
  {
    tabAction: CollateralTabAction.AddCollateral,
    label: t(translations.fixedInterestPage.adjustLoanDialog.actions.add),
    activeClassName: ACTIVE_CLASSNAME,
  },
  {
    tabAction: CollateralTabAction.WithdrawCollateral,
    label: t(translations.fixedInterestPage.adjustLoanDialog.actions.withdraw),
    activeClassName: ACTIVE_CLASSNAME,
  },
];
