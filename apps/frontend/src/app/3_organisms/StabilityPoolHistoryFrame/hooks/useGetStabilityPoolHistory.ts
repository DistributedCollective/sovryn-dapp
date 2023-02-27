import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { zeroClient } from '../../../../utils/clients';
import {
  StabilityDepositChange_OrderBy,
  useGetStabilityPoolQuery,
} from '../../../../utils/graphql/zero/generated';
import { StabilityDepositChange_Filter } from './../../../../utils/graphql/zero/generated';

export const useGetStabilityPoolHistory = (
  account: string,
  pageSize: number,
  page: number,
  filters: StabilityDepositChange_Filter,
  orderOptions: OrderOptions,
) => {
  const stabilityPoolConfig = useMemo(
    () => ({
      user: account?.toLowerCase(),
      skip: page * pageSize,
      pageSize,
      orderBy:
        (orderOptions.orderBy as StabilityDepositChange_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
      filters,
    }),
    [page, orderOptions, filters, pageSize, account],
  );

  return useGetStabilityPoolQuery({
    variables: stabilityPoolConfig,
    client: zeroClient,
  });
};
