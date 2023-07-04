import { VestingContractType } from '../../../../../utils/graphql/rsk/generated';

export type VestingContractTableRecord = {
  type: VestingContractType;
  currentBalance: string;
  availableBalance?: string;
  address: string;
  cliff: number;
};
