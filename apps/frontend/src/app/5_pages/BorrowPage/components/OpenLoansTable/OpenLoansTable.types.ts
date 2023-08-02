export type LoanItem = {
  debt: number;
  debtAsset: string;
  collateral: number;
  collateralAsset: string;
  collateralRatio: number;
  liquidationPrice: number;
  apr: string;
  rolloverDate: number;
};
