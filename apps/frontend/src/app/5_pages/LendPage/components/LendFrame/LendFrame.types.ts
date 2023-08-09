import { ReactNode } from 'react';

import { LendingPool } from '../../../../../utils/LendingPool';

export type ExpandedContentInfoProps = {
  label: ReactNode;
  value: ReactNode;
};

export type LendFrameProps = {
  pool: LendingPool;
};
