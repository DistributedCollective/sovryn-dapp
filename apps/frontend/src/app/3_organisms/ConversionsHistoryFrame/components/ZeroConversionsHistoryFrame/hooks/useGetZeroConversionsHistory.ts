import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { zeroClient } from '../../../../../../utils/clients';
import {
  Redemption_Filter,
  Redemption_OrderBy,
  useGetRedemptionsQuery,
} from '../../../../../../utils/graphql/zero/generated';

export const useGetZeroConversionsHistory = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const config = useMemo(
    () => ({
      skip: page * pageSize,
      pageSize,
      orderBy: orderOptions.orderBy as Redemption_OrderBy,
      orderDirection: orderOptions.orderDirection,
      filters: {
        redeemer: account?.toLowerCase(),
      } as Redemption_Filter,
    }),
    [
      account,
      orderOptions.orderBy,
      orderOptions.orderDirection,
      page,
      pageSize,
    ],
  );

  return useGetRedemptionsQuery({ variables: config, client: zeroClient });
};
