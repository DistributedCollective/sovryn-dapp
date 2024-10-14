import { useMemo } from 'react';

import { OrderDirection, OrderOptions } from '@sovryn/ui';

import { bobAaveClient } from '../../../../../../utils/clients';
import {
  UserTransaction_OrderBy,
  useUserBorrowTransactionsQuery,
} from '../../../../../../utils/graphql/bobAave/generated';
import { normalizeUserBorrowTransactions } from '../AaveNewLoanHistoryFrame.utils';

export const useGetNewLoans = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const config = useMemo(
    () => ({
      skip: page * pageSize,
      first: pageSize,
      orderBy: (orderOptions.orderBy as UserTransaction_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || OrderDirection.Desc,
      userAddress: account?.toLowerCase(),
    }),
    [page, orderOptions, pageSize, account],
  );

  const { loading, data, refetch } = useUserBorrowTransactionsQuery({
    variables: config,
    client: bobAaveClient,
  });

  const borrows = useMemo(() => {
    if (!data) {
      return [];
    }

    return normalizeUserBorrowTransactions(data);
  }, [data]);

  return { loading, data: borrows, refetch };
};
