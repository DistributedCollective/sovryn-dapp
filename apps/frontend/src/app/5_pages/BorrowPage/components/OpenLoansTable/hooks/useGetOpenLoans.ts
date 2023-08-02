import dayjs from 'dayjs';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetActiveLoansQuery } from '../../../../../../utils/graphql/rsk/generated';
import {
  calculateCollateralRatio,
  calculateLiquidationPrice,
  isSupportedPool,
} from '../OpenLoans.utils';
import { LoanItem } from '../OpenLoansTable.types';

export const useGetOpenLoans = () => {
  const { account } = useAccount();
  const { data, loading } = useGetActiveLoansQuery({
    variables: { user: account },
  });

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
