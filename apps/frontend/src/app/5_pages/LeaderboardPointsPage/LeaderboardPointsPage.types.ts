export type User = {
  id: number;
  wallet: string;
  balance?: string;
  spice: number;
  extraSpice: number;
  extraSpiceShot: number;
  runes: number;
};

export type UserDeposit = {
  userAddress: string;
  tokenSymbol: string;
  totalAmount: number;
};

export type UserPoints = {
  wallet: string;
  points: number;
  s3Points: number;
  total: number;
};
