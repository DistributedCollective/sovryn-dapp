import { VestingContractType } from '../../../../../utils/graphql/rsk/generated';

export type VestingType = {
  id: string;
  cliff: number;
  createdAtTimestamp: number;
  currentBalance: string;
  duration: number;
  startingBalance: string;
  type: VestingContractType;
};
