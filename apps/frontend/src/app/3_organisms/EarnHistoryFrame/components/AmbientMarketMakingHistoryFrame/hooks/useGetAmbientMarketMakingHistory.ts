import { useMemo } from 'react';

import { OrderDirection } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { bobClient } from '../../../../../../utils/clients';
import { useGetLiquidityChangesQuery } from '../../../../../../utils/graphql/bob/generated';

export const useGetAmbientMarketMakingHistory = (
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

  return useGetLiquidityChangesQuery({
    variables: config,
    client: bobClient,
  });
};
