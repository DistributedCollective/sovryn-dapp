import React from 'react';

import { FixedInterestPoolRowTitle } from '../../../../2_molecules/FixedInterestPoolRowTitle/FixedInterestPoolRowTitle';
import { LendingPool } from '../../../../../utils/LendingPool';

export const generateRowTitle = (pool: LendingPool) => (
  <FixedInterestPoolRowTitle pool={pool} isBorrow />
);
