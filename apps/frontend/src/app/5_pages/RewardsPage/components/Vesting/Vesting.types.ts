import { VestingContractType } from '../../../../../utils/graphql/rsk/generated';

export type VestingContractTableRecord = {
  type: VestingContractType;
  currentBalance: string;
  availableBalance?: string;
  address: string;
  cliff: number;
};

export type VestingHistoryItem = {
  amount: string;
  lockedUntil?: number | null;
  isUnlocked: boolean;
};
