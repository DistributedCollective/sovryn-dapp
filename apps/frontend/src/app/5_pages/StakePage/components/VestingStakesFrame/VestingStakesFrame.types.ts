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
