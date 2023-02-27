import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import {
  Conversion_OrderBy,
  useGetUserConversionsQuery,
} from '../../../../utils/graphql/mynt/generated';

export const useGetConversionsHistory = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const config = useMemo(
    () => ({
      user: account?.toLowerCase(),
      skip: page * pageSize,
      pageSize,
      orderBy: orderOptions.orderBy as Conversion_OrderBy,
      orderDirection: orderOptions.orderDirection,
    }),
    [
      account,
      orderOptions.orderBy,
      orderOptions.orderDirection,
      page,
      pageSize,
    ],
  );

  return useGetUserConversionsQuery({ variables: config });
};
