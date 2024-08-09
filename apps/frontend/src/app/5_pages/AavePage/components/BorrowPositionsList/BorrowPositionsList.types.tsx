export type BorrowPosition = {
  asset: string;
  balance: number;
  apr: number;
  apyType: 'variable' | 'fixed';
};
