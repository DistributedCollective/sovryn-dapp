import { useMemo } from 'react';

import { OrderDirection } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { isBobChain } from '../../../../../../utils/chain';
import { bobClient, sepoliaSdexClient } from '../../../../../../utils/clients';
import { useGetLiquidityChangesQuery } from '../../../../../../utils/graphql/bob/generated';

export const useGetAmbientMarketMakingHistory = (
  pageSize: number,
  page: number,
  orderDirection: OrderDirection,
) => {
  const chainId = useCurrentChain();
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
    // todo: we shouldn't use sepolia client in the end
    client: isBobChain(chainId) ? bobClient : sepoliaSdexClient,
  });
};
