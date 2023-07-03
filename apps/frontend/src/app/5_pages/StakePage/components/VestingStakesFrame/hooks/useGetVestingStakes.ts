import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { rskClient } from '../../../../../../utils/clients';
import {
  VestingContract_OrderBy,
  useGetVestingStakesQuery,
} from '../../../../../../utils/graphql/rsk/generated';

export const useGetVestingStakes = (
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
      orderBy: orderOptions.orderBy as VestingContract_OrderBy,
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

  return useGetVestingStakesQuery({ variables: config, client: rskClient });
};
