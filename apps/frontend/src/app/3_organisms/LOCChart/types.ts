export type TroveData = {
  id: string;
  debt: number;
  collateral: number;
  collateralRatio: number;
  collateralRatioSortKey_legacy: string;
};

export enum ChartSortingType {
  id = 'id',
  collateralRatio = 'collateralRatio',
}

export enum TrovesFilterType {
  above = 'above',
  below = 'below',
}
