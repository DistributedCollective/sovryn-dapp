import { t } from 'i18next';

import { translations } from '../../../../../locales/i18n';
import { VestingContractTableRecord } from './VestingStakesFrame.types';
import { AdjustVestingStakeRenderer } from './components/AdjustVestingStakeRenderer';
import { DelegateAddressCellRenderer } from './components/DelegateAddressCellRenderer';
import { StakedAmountCellRenderer } from './components/StakedAmountCellRenderer';
import { UnlockDateCellRenderer } from './components/UnlockDateCellRenderer';
import { VotingPowerCellRenderer } from './components/VotingPowerCellRenderer';

export const COLUMNS_CONFIG = [
  {
    id: 'currentBalance',
    title: t(translations.stakePage.table.stakeAmount),
    cellRenderer: (item: VestingContractTableRecord) =>
      StakedAmountCellRenderer(item),
  },
  {
    id: 'votingPower',
    title: t(translations.stakePage.table.votingPower),
    cellRenderer: (item: VestingContractTableRecord) =>
      VotingPowerCellRenderer(item),
  },
  {
    id: 'delegate',
    title: t(translations.stakePage.table.delegate),
    cellRenderer: (item: VestingContractTableRecord) =>
      DelegateAddressCellRenderer(item),
  },
  {
    id: 'createdAtTimestamp',
    title: t(translations.stakePage.table.endDate),
    cellRenderer: (item: VestingContractTableRecord) =>
      UnlockDateCellRenderer(item),
  },
  {
    id: '',
    title: '',
    cellRenderer: (item: VestingContractTableRecord) =>
      AdjustVestingStakeRenderer(item),
  },
];
