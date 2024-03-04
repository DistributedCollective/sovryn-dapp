import React, { FC } from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../../../locales/i18n';
import { BaseTable } from '../BaseTable/BaseTable';
import { TableType } from '../BaseTable/BaseTable.types';

export const StakingLeaderboard: FC = () => (
  <BaseTable
    type={TableType.Staking}
    tableSubtitle={t(translations.leaderboardPage.tables.staking.tableSubtitle)}
  />
);
