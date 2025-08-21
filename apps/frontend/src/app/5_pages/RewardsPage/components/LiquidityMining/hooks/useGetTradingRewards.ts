import { useMemo } from 'react';

import { rskClient } from '../../../../../../utils/clients';
import { useGetTradingRewardsQuery } from '../../../../../../utils/graphql/rsk/generated';

export const useGetTradingRewards = (account: string) => {
  const { loading, data, refetch } = useGetTradingRewardsQuery({
    client: rskClient,
    variables: {
      id: account,
    },
  });

  const availableTradingRewards = useMemo(
    () => data?.userRewardsEarnedHistory?.availableTradingRewards || '0',
    [data],
  );

  return { loading, refetch, availableTradingRewards };
};
