import { useMemo } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetUserRewardsEarnedHistoryQuery } from '../../../../../../utils/graphql/rsk/generated';

export const useTotalStakingRewards = () => {
  const { account } = useAccount();
  const { data, loading } = useGetUserRewardsEarnedHistoryQuery({
    variables: {
      user: account.toLowerCase(),
    },
  });

  const totalStakingRewards = useMemo(
    () => data?.userRewardsEarnedHistory?.totalStakingRewards || '0',
    [data],
  );

  return { loading, totalStakingRewards };
};
