import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { zeroClient } from '../../../../utils/clients';
import {
  Redemption_OrderBy,
  useGetRedemptionsQuery,
} from '../../../../utils/graphql/zero/generated';
import { Redemption_Filter } from './../../../../utils/graphql/zero/generated';

export const useGetRedemptionsHistory = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const redemptionConfig = useMemo(
    () => ({
      skip: page * pageSize,
      pageSize,
      orderBy: (orderOptions.orderBy as Redemption_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
      filters: {
        redeemer: account,
      } as Redemption_Filter,
    }),
    [page, orderOptions, pageSize, account],
  );

  const { loading, data } = useGetRedemptionsQuery({
    variables: redemptionConfig,
    client: zeroClient,
  });

  return { loading, data };
};
