import { t } from 'i18next';

import { translations } from '../../../../../locales/i18n';
import { Vesting } from './VestingStakesFrame.types';
import { AdjustVestingStakeRenderer } from './components/AdjustVestingStakeRenderer';
import { DelegateAddressCellRenderer } from './components/DelegateAddressCellRenderer';
import { StakedAmountCellRenderer } from './components/StakedAmountCellRenderer';
import { UnlockDateCellRenderer } from './components/UnlockDateCellRenderer';
import { VotingPowerCellRenderer } from './components/VotingPowerCellRenderer';

export const COLUMNS_CONFIG = [
  {
    id: 'stakeAmount',
    title: t(translations.stakePage.table.stakeAmount),
    cellRenderer: (item: Vesting) => StakedAmountCellRenderer(item),
  },
  {
    id: 'votingPower',
    title: t(translations.stakePage.table.votingPower),
    cellRenderer: (item: Vesting) => VotingPowerCellRenderer(item),
  },
  {
    id: 'delegate',
    title: t(translations.stakePage.table.delegate),
    cellRenderer: (item: Vesting) => DelegateAddressCellRenderer(item),
  },
  {
    id: 'unlockDate',
    title: t(translations.stakePage.table.endDate),
    cellRenderer: (item: Vesting) => UnlockDateCellRenderer(item),
  },
  {
    id: 'actions',
    title: ' ',
    cellRenderer: (item: Vesting) => AdjustVestingStakeRenderer(item),
  },
];
