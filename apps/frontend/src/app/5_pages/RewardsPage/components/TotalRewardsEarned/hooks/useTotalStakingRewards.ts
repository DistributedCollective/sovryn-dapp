import { useMemo } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { isRskChain } from '../../../../../../utils/chain';
import { useGetUserRewardsEarnedHistoryQuery } from '../../../../../../utils/graphql/rsk/generated';

export const useTotalStakingRewards = () => {
  const { account } = useAccount();
  const chainId = useCurrentChain();
  const { data, loading } = useGetUserRewardsEarnedHistoryQuery({
    variables: {
      user: account.toLowerCase(),
    },
  });

  const totalStakingRewards = useMemo(
    () =>
      isRskChain(chainId)
        ? data?.userRewardsEarnedHistory?.totalFeeWithdrawn || '0'
        : '0',
    [chainId, data?.userRewardsEarnedHistory?.totalFeeWithdrawn],
  );

  return { loading, totalStakingRewards };
};
