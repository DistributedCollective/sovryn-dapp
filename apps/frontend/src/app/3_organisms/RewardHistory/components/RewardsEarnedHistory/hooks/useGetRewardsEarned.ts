import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { rskClient } from '../../../../../../utils/clients';
import {
  RewardsEarnedAction,
  RewardsEarnedHistoryItem,
  RewardsEarnedHistoryItem_OrderBy,
  useGetRewardsEarnedHistoryQuery,
} from '../../../../../../utils/graphql/rsk/generated';

export const useGetRewardsEarned = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
  actions: RewardsEarnedAction[],
) => {
  const config = useMemo(
    () => ({
      user: account.toLowerCase(),
      skip: page * pageSize,
      pageSize,
      orderBy: orderOptions.orderBy as RewardsEarnedHistoryItem_OrderBy,
      orderDirection: orderOptions.orderDirection,
      actions,
    }),
    [
      account,
      page,
      pageSize,
      orderOptions.orderBy,
      orderOptions.orderDirection,
      actions,
    ],
  );

  const { loading, data } = useGetRewardsEarnedHistoryQuery({
    variables: config,
    client: rskClient,
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.rewardsEarnedHistoryItems;
  }, [data]);

  return { loading, data: list as RewardsEarnedHistoryItem[] };
};
