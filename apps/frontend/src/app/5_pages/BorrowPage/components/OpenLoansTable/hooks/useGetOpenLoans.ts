import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useGetActiveLoansQuery } from '../../../../../../utils/graphql/rsk/generated';
import {
  calculateCollateralRatio,
  calculateLiquidationPrice,
  isSupportedPool,
} from '../OpenLoans.utils';
import { LoanItem } from '../OpenLoansTable.types';

export const useGetOpenLoans = () => {
  const { account } = useAccount();
  const { value: blockNumber } = useBlockNumber();
  const [processedBlock, setProcessedBlock] = useState<number | undefined>();
  const { data, loading, refetch } = useGetActiveLoansQuery({
    variables: { user: account },
  });

  useEffect(() => {
    if (blockNumber !== processedBlock) {
      refetch();
      setProcessedBlock(blockNumber);
    }
  }, [blockNumber, processedBlock, refetch]);

  if (!data?.loans) {
    return { data: [], loading };
  }

  const result: LoanItem[] =
    data?.loans
      .filter(item =>
        isSupportedPool(item.loanToken.symbol, item.collateralToken.symbol),
      )
      .map(item => ({
        debt: Number(item.borrowedAmount),
        debtAsset: item.loanToken.symbol || '',
        collateral: Number(item.positionSize),
        collateralAsset: item.collateralToken.symbol || '',
        collateralRatio: calculateCollateralRatio(
          item.borrowedAmount,
          item.loanToken.lastPriceBtc,
          item.positionSize,
          item.collateralToken.lastPriceBtc,
        ),
        liquidationPrice: calculateLiquidationPrice(
          item.borrowedAmount,
          item.positionSize,
        ),
        apr: item?.borrow?.[0].interestRate || '',
        rolloverDate: item.nextRollover || dayjs().unix(),
      })) || [];

  return { data: result, loading };
};
