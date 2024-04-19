import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import {
  SubgraphType,
  getSubgraphClient,
} from '../../../../../../utils/clients';
import {
  VestingHistoryItem_OrderBy,
  useGetDelegateChangesForVestingsQuery,
  useGetUserVestingContractsQuery,
} from '../../../../../../utils/graphql/rsk/generated';
import { VestingDelegateChangeItem } from '../VestingDelegateChanges.types';

export const useGetStakingDelegateChanges = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const chainId = useCurrentChain();
  const { data: vestings, loading: loadingVestings } =
    useGetUserVestingContractsQuery({
      variables: {
        userAddress: account.toLowerCase(),
      },
      client: getSubgraphClient(SubgraphType.STAKING, chainId),
    });

  const config = useMemo(
    () => ({
      vestingContracts: (vestings?.vestingContracts ?? []).map(v => v.id),
      skip: page * pageSize,
      pageSize,
      orderBy: orderOptions.orderBy as VestingHistoryItem_OrderBy,
      orderDirection: orderOptions.orderDirection,
    }),
    [
      orderOptions.orderBy,
      orderOptions.orderDirection,
      page,
      pageSize,
      vestings?.vestingContracts,
    ],
  );

  const { loading, data } = useGetDelegateChangesForVestingsQuery({
    variables: config,
    client: getSubgraphClient(SubgraphType.STAKING, chainId),
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.vestingHistoryItems;
  }, [data]);

  return {
    loading: loading && loadingVestings,
    data: list as VestingDelegateChangeItem[],
    ids: (vestings?.vestingContracts ?? []).map(v => v.id),
  };
};
