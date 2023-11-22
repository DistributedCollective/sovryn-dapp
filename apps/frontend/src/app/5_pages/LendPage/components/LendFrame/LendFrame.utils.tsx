import React from 'react';

import { FixedInterestPoolRowSubTitle } from '../../../../2_molecules/FixedInterestPoolRowSubTitle/FixedInterestPoolRowSubTitle';
import { FixedInterestPoolRowTitle } from '../../../../2_molecules/FixedInterestPoolRowTitle/FixedInterestPoolRowTitle';
import { LendingPool } from '../../../../../utils/LendingPool';

export const generateRowTitle = (pool: LendingPool) => (
  <FixedInterestPoolRowTitle pool={pool} isBorrow={false} />
);

export const generateRowSubTitle = (pool: LendingPool) => (
  <FixedInterestPoolRowSubTitle pool={pool} />
);
