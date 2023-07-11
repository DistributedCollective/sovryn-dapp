import { useCallback, useEffect, useState } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';
import { getRskChainId } from '../../../../../../utils/chain';
import { useGetStakingBalanceOf } from '../../../hooks/useGetStakingBalanceOf';

export const useGetPersonalStakingStatistics = () => {
  const { account } = useAccount();
  const stakingContract = useGetProtocolContract('staking', getRskChainId());
  const [votingPower, setVotingPower] = useState(0);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const balance = useGetStakingBalanceOf(account);

  const updateVotingPower = useCallback(async () => {
    if (!stakingContract || isDataFetched) return;

    try {
      const result = await asyncCall('votingPower', () =>
        stakingContract.getCurrentVotes(account),
      );
      if (result) {
        setVotingPower(result);
        setIsDataFetched(true);
      }
    } catch (error) {
      console.error('Error fetching voting power:', error);
    }
  }, [stakingContract, account, isDataFetched]);

  useEffect(() => {
    if (account) {
      updateVotingPower();
    }
  }, [account, updateVotingPower]);

  return { balance, votingPower };
};
