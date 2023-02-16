export type TroveData = {
  id: string;
  debt: string;
  rawStake: string;
  collateral: number;
  collateralRatio: number;
  collateralRatioSortKey: string;
  collateralRatioSortKey_legacy: string;
  rawSnapshotOfTotalRedistributedDebt: string;
  rawSnapshotOfTotalRedistributedCollateral: string;
};

export enum ChartSortingType {
  id = 'id',
  collateralRatio = 'collateralRatio',
}

export enum TrovesFilterType {
  above = 'above',
  below = 'below',
}
