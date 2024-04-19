import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import {
  SubgraphType,
  getSubgraphClient,
} from '../../../../../../utils/clients';
import {
  useGetStakingWithdrawsQuery,
  V2StakingWithdrawn_OrderBy,
} from '../../../../../../utils/graphql/rsk/generated';
import { StakingWithdrawItem } from '../StakingWithdraws.types';

export const useGetStakingWithdraws = (
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
      orderBy: orderOptions.orderBy as V2StakingWithdrawn_OrderBy,
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

  const { loading, data } = useGetStakingWithdrawsQuery({
    variables: config,
    client: getSubgraphClient(SubgraphType.STAKING, chainId),
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.v2StakingWithdrawns;
  }, [data]);

  return { loading, data: list as StakingWithdrawItem[] };
};
