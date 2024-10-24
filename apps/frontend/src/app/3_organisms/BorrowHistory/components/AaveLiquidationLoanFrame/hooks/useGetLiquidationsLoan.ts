import { useMemo } from 'react';

import { OrderDirection, OrderOptions } from '@sovryn/ui';

import { bobAaveClient } from '../../../../../../utils/clients';
import {
  UserTransaction_OrderBy,
  useUserLiquidationsTransactionsQuery,
} from '../../../../../../utils/graphql/bobAave/generated';
import { normalizeUserLiquidationTransactions } from '../AaveLiquidationLoanFrame.utils';

export const useGetLiquidationsLoan = (
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

  const { loading, data, refetch } = useUserLiquidationsTransactionsQuery({
    variables: config,
    client: bobAaveClient,
  });

  const borrows = useMemo(() => {
    if (!data) {
      return [];
    }

    return normalizeUserLiquidationTransactions(data);
  }, [data]);

  return { loading, data: borrows, refetch };
};
