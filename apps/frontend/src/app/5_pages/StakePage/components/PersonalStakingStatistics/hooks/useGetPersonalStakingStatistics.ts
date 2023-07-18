import { useCallback, useEffect, useState } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';
import { useGetStakingBalanceOf } from '../../../hooks/useGetStakingBalanceOf';

export const useGetPersonalStakingStatistics = () => {
  const { account } = useAccount();
  const stakingContract = useGetProtocolContract('staking');
  const [votingPower, setVotingPower] = useState(0);

  const { balance } = useGetStakingBalanceOf(account);

  const updateVotingPower = useCallback(async () => {
    if (!stakingContract) {
      return;
    }

    try {
      const result = await asyncCall(`${account}/votingPower`, () =>
        stakingContract.getCurrentVotes(account),
      );
      if (result) {
        setVotingPower(result);
      }
    } catch (error) {
      console.error('Error fetching voting power:', error);
    }
  }, [stakingContract, account]);

  useEffect(() => {
    if (account) {
      updateVotingPower();
    }
  }, [account, updateVotingPower]);

  return { balance, votingPower };
};
