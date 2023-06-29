import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import {
  InputMaybe,
  TroveChange_Filter,
  TroveChange_OrderBy,
  useGetTroveQuery,
} from '../../../../../../utils/graphql/zero/generated';

export const useGetTroves = (
  account: string,
  pageSize: number,
  page: number,
  filters: InputMaybe<TroveChange_Filter> | undefined,
  orderOptions: OrderOptions,
) => {
  const troveConfig = useMemo(
    () => ({
      user: account?.toLowerCase(),
      skip: page * pageSize,
      pageSize,
      orderBy: (orderOptions.orderBy as TroveChange_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
      filters,
    }),
    [account, page, orderOptions, filters, pageSize],
  );

  return useGetTroveQuery({ variables: troveConfig });
};
