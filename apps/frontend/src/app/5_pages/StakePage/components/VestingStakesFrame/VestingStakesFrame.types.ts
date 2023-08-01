import { VestingContractType } from '../../../../../utils/graphql/rsk/generated';

export type VestingData = {
  vestingAddress: string;
  vestingCreationType: string;
  vestingType: string;
};

export type VestingGroup =
  | 'genesis'
  | 'origin'
  | 'team'
  | 'reward'
  | 'fouryear'
  | 'fish'
  | 'fishAirdrop';

export type Vesting = {
  staking: string;
  type: VestingGroup;
  typeCreation: string;
  vestingContract: string;
};

export type VestingContractTableRecord = {
  type: VestingContractType;
  currentBalance: string;
  availableBalance?: string;
  address: string;
  cliff: number;
  createdAtTimestamp: number;
  duration?: number | null;
  delegatedAddress?: string | null;
};
