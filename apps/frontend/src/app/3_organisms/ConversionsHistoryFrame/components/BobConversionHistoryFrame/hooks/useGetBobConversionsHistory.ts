import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { getCurrentChain } from '../../../../../../hooks/useChainStore';
import {
  SubgraphType,
  getSubgraphClient,
} from '../../../../../../utils/clients';
import {
  Swap_OrderBy,
  useGetSwapHistoryQuery,
} from '../../../../../../utils/graphql/bob/generated';

export const useGetBobConversionsHistory = (
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
      orderBy: orderOptions.orderBy as Swap_OrderBy,
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

  return useGetSwapHistoryQuery({
    variables: config,
    client: getSubgraphClient(SubgraphType.GENERAL, getCurrentChain()),
  });
};
