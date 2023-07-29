import { LoanItem } from '../OpenLoansTable.types';

// TODO: Implement with a subgraph query
export const useGetOpenLoans = () => {
  const mockData: LoanItem[] = [
    {
      debt: '1',
      debtAsset: 'BTC',
      collateral: '50000',
      collateralAsset: 'DLLR',
      collateralRatio: 170,
      liquidationPrice: '30000',
      apr: '2',
      rolloverDate: '2023-08-02 15:15:15 +UTC',
    },
    {
      debt: '1000000',
      debtAsset: 'DLLR',
      collateral: '6.15',
      collateralAsset: 'BTC',
      collateralRatio: 210,
      liquidationPrice: '30000',
      apr: '2',
      rolloverDate: '2023-07-31 12:12:12 +UTC',
    },
  ];

  return mockData;
};
