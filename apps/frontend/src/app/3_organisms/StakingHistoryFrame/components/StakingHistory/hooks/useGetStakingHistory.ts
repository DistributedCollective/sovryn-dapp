import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import {
  SubgraphType,
  getSubgraphClient,
} from '../../../../../../utils/clients';
import {
  useGetStakeHistoryQuery,
  V2TokensStaked_OrderBy,
} from '../../../../../../utils/graphql/rsk/generated';
import { StakingHistoryItem } from '../StakingHistory.types';

export const useGetStakingHistory = (
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
      orderBy: orderOptions.orderBy as V2TokensStaked_OrderBy,
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

  const { loading, data } = useGetStakeHistoryQuery({
    variables: config,
    client: getSubgraphClient(SubgraphType.STAKING, chainId),
  });

  const stakes = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.v2TokensStakeds;
  }, [data]);

  return { loading, data: stakes as StakingHistoryItem[] };
};
