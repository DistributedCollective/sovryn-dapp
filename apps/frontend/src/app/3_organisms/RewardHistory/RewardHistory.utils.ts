import { t } from 'i18next';

import { translations } from '../../../locales/i18n';
import { RewardHistoryType } from './RewardHistory.types';

export const rewardHistoryOptions = [
  {
    value: RewardHistoryType.liquidityMiningRewards,
    label: t(translations.rewardHistory.types.liquidityMiningRewards),
  },
  {
    value: RewardHistoryType.stabilityPoolRewards,
    label: t(translations.rewardHistory.types.stabilityPoolRewards),
  },
  {
    value: RewardHistoryType.stabilityPoolSubsidies,
    label: t(translations.rewardHistory.types.stabilityPoolSubsidies),
  },
  {
    value: RewardHistoryType.stakingRevenue,
    label: t(translations.rewardHistory.types.stakingRevenue),
  },
  {
    value: RewardHistoryType.stakingSubsidies,
    label: t(translations.rewardHistory.types.stakingSubsidies),
  },
  {
    value: RewardHistoryType.vestingRewards,
    label: t(translations.rewardHistory.types.vestingRewards),
  },
];
