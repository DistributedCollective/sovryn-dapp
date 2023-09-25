import React from 'react';

import { t } from 'i18next';

import { Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import {
  VestingHistoryItem,
  VestingHistoryItemAction,
} from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';

export const getTransactionType = (operation: VestingHistoryItemAction) => {
  switch (operation) {
    case VestingHistoryItemAction.TokensWithdrawn:
      return t(translations.rewardHistory.vestingOperation.tokensWithdrawn);
    case VestingHistoryItemAction.TeamTokensRevoked:
      return t(translations.rewardHistory.vestingOperation.teamTokensRevoked);
    case VestingHistoryItemAction.TokensStaked:
      return t(translations.rewardHistory.vestingOperation.tokensStaked);
    default:
      return operation;
  }
};

export const generateRowTitle = (tx: VestingHistoryItem) => (
  <Paragraph size={ParagraphSize.small} className="text-left">
    {getTransactionType(tx.action)}
    {' - '}
    {dateFormat(tx.timestamp)}
  </Paragraph>
);
