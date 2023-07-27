import { LendingHistoryType } from '../../../../../utils/graphql/rsk/generated';

export type LendingEvent = {
  amount: string;
  asset: string;
  transactionHash: string;
  timestamp: number;
  type: LendingHistoryType;
};
