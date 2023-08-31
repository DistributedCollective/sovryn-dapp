import { Decimal } from '@sovryn/utils';

export type LoanItem = {
  id: string;
  debt: number;
  debtAsset: string;
  collateral: number;
  collateralAsset: string;
  collateralRatio: number;
  liquidationPrice: number;
  apr: string;
  rolloverDate: number;
};

export type LoanItemSmartContract = {
  id: string;
  debt: Decimal;
  collateral: Decimal;
  interestOwedPerDay: Decimal;
};
