import { useCallback, useEffect, useState } from 'react';

// import { MAX_STAKING_APR_API_LINK } from '../../../../../../constants/links';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../../../utils/chain';

export const useGetStakingStatistics = () => {
  const stakingContract = useGetProtocolContract('staking', getRskChainId());
  const [stakingStats, setStakingStats] = useState({
    totalStakedSov: 0,
    totalVotingPower: 0,
    maxStakingApr: 0,
  });
  const { value: block } = useBlockNumber();

  const fetchStakingStatistics = useCallback(async () => {
    if (
      block > 0 &&
      stakingContract &&
      stakingStats.totalStakedSov === 0 &&
      stakingStats.totalVotingPower === 0
    ) {
      const timestamp = Math.ceil(Date.now() / 1e3);
      const [stakingStatistics, votingPowerAmount] = await Promise.all([
        stakingContract.getPriorTotalStakesForDate(timestamp, block - 1),
        stakingContract.getPriorTotalVotingPower(block - 1, timestamp),
      ]);

      if (stakingStatistics) {
        setStakingStats(prevStats => ({
          ...prevStats,
          totalStakedSov: stakingStatistics,
        }));
      }

      if (votingPowerAmount) {
        setStakingStats(prevStats => ({
          ...prevStats,
          totalVotingPower: votingPowerAmount,
        }));
      }
    }
    //TODO - CORS issue with API, need to fix, waiting for Soulbit's response
    // try {
    //   const response = await fetch(MAX_STAKING_APR_API_LINK);
    //   const data = await response.json();
    //   if (data && data.query_result && data.query_result.rows && data.query_result.rows.length > 0) {
    //     const maxStakingApr = data.query_result.rows[0].apr_max_btc;
    //     setStakingStats((prevStats) => ({
    //       ...prevStats,
    //       maxStakingApr,
    //     }));
    //   }
    // } catch (error) {
    //     Handle fetch error
    //   console.error('Error fetching max staking APR:', error);
    // }
  }, [
    stakingContract,
    block,
    stakingStats.totalStakedSov,
    stakingStats.totalVotingPower,
  ]);

  useEffect(() => {
    fetchStakingStatistics();
  }, [fetchStakingStatistics]);

  return stakingStats;
};
