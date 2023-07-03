import { useCallback, useEffect, useState } from 'react';

import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../../../utils/chain';

export const useGetStakingStatistics = () => {
  const stakingContract = useGetProtocolContract('staking', getRskChainId());
  const [totalStakedSov, setTotalStakedSov] = useState(0);
  const [totalVotingPower, setTotalVotingPower] = useState(0);
  const { value: block } = useBlockNumber();

  const fetchStakingStatistics = useCallback(async () => {
    if (block > 0 && stakingContract) {
      const timestamp = Math.ceil(Date.now() / 1e3);
      const [stakingStatistics, votingPowerAmount] = await Promise.all([
        stakingContract.getPriorTotalStakesForDate(timestamp, block - 1),
        stakingContract.getPriorTotalVotingPower(block - 1, timestamp),
      ]);

      if (stakingStatistics) {
        setTotalStakedSov(stakingStatistics);
      }

      if (votingPowerAmount) {
        setTotalVotingPower(votingPowerAmount);
      }
    }
  }, [stakingContract, block]);

  useEffect(() => {
    fetchStakingStatistics();
  }, [fetchStakingStatistics]);

  return { totalStakedSov, totalVotingPower };
};
