import { t } from 'i18next';

import { translations } from '../../../locales/i18n';
import { StakingistoryType } from './StakingHistoryFrame.type';

export const stakingHistoryOptions = [
  {
    value: StakingistoryType.increase,
    label: t(translations.stakingHistory.increase),
  },
  {
    value: StakingistoryType.unstake,
    label: t(translations.stakingHistory.unstake),
  },
  {
    value: StakingistoryType.extend,
    label: t(translations.stakingHistory.extend),
  },
  {
    value: StakingistoryType.delegate,
    label: t(translations.stakingHistory.delegate),
  },
];
