import { useCallback, useEffect, useState } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../../../utils/chain';

export const useGetPersonalStakingStatistics = () => {
  const { account } = useAccount();
  const stakingContract = useGetProtocolContract('staking', getRskChainId());
  const [stakedSov, setStakedSov] = useState(0);
  const [votingPower, setVotingPower] = useState(0);

  const getStakedSov = useCallback(async () => {
    const stakingStatistics = await stakingContract?.balanceOf(account);
    if (stakingStatistics) {
      setStakedSov(stakingStatistics);
    }
  }, [stakingContract, account]);

  const getVotingPower = useCallback(async () => {
    const votingPowerAmount = await stakingContract?.getCurrentVotes(account);
    if (votingPowerAmount) {
      setVotingPower(votingPowerAmount);
    }
  }, [stakingContract, account]);

  useEffect(() => {
    if (account) {
      getStakedSov();
      getVotingPower();
    }
  }, [getStakedSov, getVotingPower, account]);

  return { stakedSov, votingPower };
};
