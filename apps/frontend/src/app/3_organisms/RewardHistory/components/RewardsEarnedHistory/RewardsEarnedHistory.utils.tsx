import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import {
  RewardsEarnedAction,
  RewardsEarnedHistoryItem,
} from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';

export const getTransactionType = (action: RewardsEarnedAction) => {
  switch (action) {
    case RewardsEarnedAction.RewardClaimed:
      return t(
        translations.rewardHistory.stakingOperation.liquidityMiningRewards,
      );
    case RewardsEarnedAction.UserFeeWithdrawn:
      return t(translations.rewardHistory.stakingOperation.stakingRevenue);
    case RewardsEarnedAction.StakingRewardWithdrawn:
      return t(translations.rewardHistory.stakingOperation.stakingSubsidies);
    default:
      return '';
  }
};

export const generateRowTitle = (tx: RewardsEarnedHistoryItem) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {getTransactionType(tx.action)}
    {' - '}
    {dateFormat(tx.timestamp)}
  </Paragraph>
);
