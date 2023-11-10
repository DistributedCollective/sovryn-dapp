import { TAB_ACTIVE_CLASSNAME } from '../../../../../constants/general';
import { AdjustType } from './AdjustAndDepositModal.types';

export const TABS = [
  {
    tabAction: AdjustType.Deposit,
    label: 'Deposit',
    activeClassName: TAB_ACTIVE_CLASSNAME,
  },
  {
    tabAction: AdjustType.Withdraw,
    label: 'Withdraw',
    activeClassName: TAB_ACTIVE_CLASSNAME,
  },
];
