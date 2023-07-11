import { ReactNode } from 'react';

export type StakingStatRenderProps = {
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
