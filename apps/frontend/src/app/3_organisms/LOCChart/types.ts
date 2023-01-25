export type ChartDataStructure = {
  tx: string;
  sequenceNumber: string;
  collateralAmount: string;
  debtAmount: string;
  collateralRatio: number;
}[];

export type TroveData = {
  changes: {
    sequenceNumber: string;
    transaction: {
      id: string;
      sequenceNumber: string;
    };
    trove: {
      id: string;
      collateral: number;
      debt: string;
      collateralRatioSortKey: number;
    };
  }[];
};

export enum ChartSortingType {
  tx = 'tx',
  collateralRatio = 'collateralRatio',
}

export enum TrovesFilterType {
  above = 'above',
  below = 'below',
}
