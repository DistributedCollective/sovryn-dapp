import { useMemo } from 'react';

import { OrderDirection } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { rskClient } from '../../../../../../utils/clients';
import { useGetLiquidityHistoryQuery } from '../../../../../../utils/graphql/rsk/generated';

export const useGetMarketMakingHistory = (
  pageSize: number,
  page: number,
  orderDirection: OrderDirection,
) => {
  const { account } = useAccount();
  const config = useMemo(
    () => ({
      user: account,
      skip: page * pageSize,
      pageSize,
      orderDirection,
    }),
    [account, orderDirection, page, pageSize],
  );

  return useGetLiquidityHistoryQuery({
    variables: config,
    client: rskClient,
  });
};
