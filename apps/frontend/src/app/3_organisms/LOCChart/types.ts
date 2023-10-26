import { Decimalish } from '@sovryn/utils';

export type TroveData = {
  id: string;
  debt: Decimalish;
  collateral: Decimalish;
  collateralRatio: Decimalish;
  collateralRatioSortKey_legacy: string;
};

export enum ChartSortingType {
  id = 'id',
  collateralRatio = 'collateralRatio',
}
