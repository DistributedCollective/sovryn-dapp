import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

export type LoanItem = {
  id: string;
  debt: number;
  debtAsset: SupportedTokens;
  collateral: number;
  collateralAsset: SupportedTokens;
  collateralRatio: number;
  liquidationPrice: number;
  apr: string;
  rolloverDate: number;
  interestOwedPerDay: number;
  startMargin: Decimal;
  currentMargin: Decimal;
  maintenanceMargin: Decimal;
};
