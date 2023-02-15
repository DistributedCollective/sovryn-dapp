export type TroveData = {
  id: string;
  debt: string;
  collateral: number;
  collateralRatio: number;
  collateralRatioSortKey: string;
};

export enum ChartSortingType {
  id = 'id',
  collateralRatio = 'collateralRatio',
}

export enum TrovesFilterType {
  above = 'above',
  below = 'below',
}
