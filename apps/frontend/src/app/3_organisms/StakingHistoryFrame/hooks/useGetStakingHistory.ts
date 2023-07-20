import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { rskClient } from '../../../../utils/clients';
import {
  BitcoinTransfer_OrderBy,
  useGetFundingQuery,
} from '../../../../utils/graphql/rsk/generated';

export const useGetStakingHistory = (
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
      orderBy: orderOptions.orderBy as BitcoinTransfer_OrderBy,
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

  return useGetFundingQuery({ variables: config, client: rskClient });
};
