import { t } from 'i18next';

import { translations } from '../../../locales/i18n';
import { StakingHistoryType } from './StakingHistoryFrame.type';

export const stakingHistoryOptions = [
  {
    value: StakingHistoryType.increase,
    label: t(translations.stakingHistory.increase),
  },
  {
    value: StakingHistoryType.unstake,
    label: t(translations.stakingHistory.unstake),
  },
  {
    value: StakingHistoryType.extend,
    label: t(translations.stakingHistory.extend),
  },
  {
    value: StakingHistoryType.delegate,
    label: t(translations.stakingHistory.delegate),
  },
  {
    value: StakingHistoryType.delegateVesting,
    label: t(translations.stakingHistory.delegateVesting),
  },
];
