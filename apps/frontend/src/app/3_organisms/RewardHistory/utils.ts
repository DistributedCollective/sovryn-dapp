import { t } from 'i18next';

import { translations } from '../../../locales/i18n';
import { RewardHistoryType } from './types';

export const rewardHistoryOptions = [
  {
    value: RewardHistoryType.stabilityPoolRewards,
    label: t(translations.rewardHistory.types.stabilityPoolRewards),
  },
  {
    value: RewardHistoryType.stabilityPoolSubsidies,
    label: t(translations.rewardHistory.types.stabilityPoolSubsidies),
  },
];
