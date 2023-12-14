import { t } from 'i18next';

import { TAB_ACTIVE_CLASSNAME } from '../../../../../constants/general';
import { translations } from '../../../../../locales/i18n';
import { CollateralTabAction, DebtTabAction } from './AdjustLoanForm.types';

export const INTEREST_DURATION = 3600; // according to the PRD

export const DEBT_TABS = [
  {
    tabAction: DebtTabAction.Borrow,
    label: t(translations.fixedInterestPage.adjustLoanDialog.actions.borrow),
    activeClassName: TAB_ACTIVE_CLASSNAME,
  },
  {
    tabAction: DebtTabAction.Repay,
    label: t(translations.fixedInterestPage.adjustLoanDialog.actions.repay),
    activeClassName: TAB_ACTIVE_CLASSNAME,
  },
  {
    tabAction: DebtTabAction.Close,
    label: t(translations.fixedInterestPage.adjustLoanDialog.actions.close),
    activeClassName: TAB_ACTIVE_CLASSNAME,
  },
];

export const COLLATERAL_TABS = [
  {
    tabAction: CollateralTabAction.AddCollateral,
    label: t(translations.fixedInterestPage.adjustLoanDialog.actions.add),
    activeClassName: TAB_ACTIVE_CLASSNAME,
  },
  {
    tabAction: CollateralTabAction.WithdrawCollateral,
    label: t(translations.fixedInterestPage.adjustLoanDialog.actions.withdraw),
    activeClassName: TAB_ACTIVE_CLASSNAME,
  },
];
