export type ChartDataStructure = {
  tx: string;
  id: string;
  sequenceNumber: string;
  collateralAmount: string;
  debtAmount: string;
  collateralRatio: number;
}[];

export type ChartBarData = {
  address: string;
};

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
      address: string;
    };
  }[];
};

export enum ChartSortingType {
  id = 'id',
  tx = 'tx',
  collateralRatio = 'collateralRatio',
}

export enum TrovesFilterType {
  above = 'above',
  below = 'below',
}
