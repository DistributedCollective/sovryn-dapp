import React, { FC } from 'react';

import { BaseTable } from '../BaseTable/BaseTable';
import { TableType } from '../BaseTable/BaseTable.types';

export const StakingLeaderboard: FC = () => (
  <BaseTable type={TableType.Staking} />
);
