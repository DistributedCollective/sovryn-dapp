import { t } from 'i18next';

import { translations } from '../../../../../locales/i18n';
import { VestingContractTableRecord } from './Vesting.types';
import {
  UnlockSchedule,
  UnlockedBalance,
  Withdraw,
  renderBalance,
  renderContractAddress,
} from './Vestings.utils';

export const columnsConfig = [
  {
    id: 'vestingType',
    title: t(translations.rewardPage.vesting.table.titles.vestingType),
    cellRenderer: UnlockSchedule,
  },
  {
    id: 'balance',
    title: t(translations.rewardPage.vesting.table.titles.balance),
    cellRenderer: (item: VestingContractTableRecord) =>
      renderBalance(item.currentBalance),
  },
  {
    id: 'available',
    title: t(translations.rewardPage.vesting.table.titles.available),
    cellRenderer: UnlockedBalance,
  },
  {
    id: 'address',
    title: t(translations.rewardPage.vesting.table.titles.address),
    cellRenderer: renderContractAddress,
  },
  {
    id: '',
    title: '',
    cellRenderer: Withdraw,
  },
];
