import { ReactNode } from 'react';

export type StakingStatisticsProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
};

export enum AdjustStakeAction {
  Increase = 'increase',
  Decrease = 'decrease',
  Extend = 'extend',
  Delegate = 'delegate',
  Stake = 'stake',
}
