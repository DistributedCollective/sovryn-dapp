import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { rskClient } from '../../../../../../utils/clients';
import {
  Borrow_OrderBy,
  useGetBorrowHistoryQuery,
} from '../../../../../../utils/graphql/rsk/generated';

export const useGetNewLoans = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const config = useMemo(
    () => ({
      skip: page * pageSize,
      pageSize,
      orderBy: (orderOptions.orderBy as Borrow_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
      user: account?.toLowerCase(),
    }),
    [page, orderOptions, pageSize, account],
  );

  const { loading, data, refetch } = useGetBorrowHistoryQuery({
    variables: config,
    client: rskClient,
  });

  const borrows = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.borrows.map(tx => ({
      id: tx.transaction.id,
      loanId: tx.loanId.id,
      loanToken: tx.loanToken,
      collateralToken: tx.collateralToken,
      newPrincipal: tx.newPrincipal,
      newCollateral: tx.newCollateral,
      interestRate: tx.interestRate,
      interestDuration: tx.interestDuration,
      collateralToLoanRate: tx.collateralToLoanRate,
      timestamp: tx.timestamp,
      hash: tx.transaction.id,
    }));
  }, [data]);

  return { loading, data: borrows, refetch };
};
