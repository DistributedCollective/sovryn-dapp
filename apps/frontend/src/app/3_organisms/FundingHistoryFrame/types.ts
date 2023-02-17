export type FundingHistoryType = {
  timestamp: number;
  type: string;
  sent: string | null;
  received: string | null;
  serviceFee: string | null;
  txHash: string;
};
