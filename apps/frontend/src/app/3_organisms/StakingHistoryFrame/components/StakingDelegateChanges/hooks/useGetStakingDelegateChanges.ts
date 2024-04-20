import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import {
  SubgraphType,
  getSubgraphClient,
} from '../../../../../../utils/clients';
import {
  useGetDelegateChangesQuery,
  V2DelegateChanged_OrderBy,
} from '../../../../../../utils/graphql/rsk/generated';
import { StakingDelegateChangeItem } from '../StakingDelegateChanges.types';

export const useGetStakingDelegateChanges = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const chainId = useCurrentChain();
  const config = useMemo(
    () => ({
      user: account.toLowerCase(),
      skip: page * pageSize,
      pageSize,
      orderBy: orderOptions.orderBy as V2DelegateChanged_OrderBy,
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

  const { loading, data } = useGetDelegateChangesQuery({
    variables: config,
    client: getSubgraphClient(SubgraphType.STAKING, chainId),
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.v2DelegateChangeds;
  }, [data]);

  return { loading, data: list as StakingDelegateChangeItem[] };
};
