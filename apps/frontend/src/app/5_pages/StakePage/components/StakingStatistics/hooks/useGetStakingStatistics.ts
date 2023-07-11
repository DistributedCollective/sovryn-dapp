import { useCallback, useEffect, useState } from 'react';

import { MS } from '../../../../../../constants/general';
import { MAX_STAKING_APR_API_LINK } from '../../../../../../constants/links';
// import { MAX_STAKING_APR_API_LINK } from '../../../../../../constants/links';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../../../utils/chain';

const REDASH_API_KEY = process.env.REACT_APP_REDASH_API_KEY;

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
      (stakingStats.totalStakedSov === 0 || stakingStats.totalVotingPower === 0)
    ) {
      const timestamp = Math.ceil(Date.now() / MS);
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

    if (REDASH_API_KEY) {
      try {
        const response = await fetch(
          `${MAX_STAKING_APR_API_LINK}?api_key=${REDASH_API_KEY}`,
        );
        if (response.ok) {
          const data = await response.json();
          if (
            data &&
            data.query_result &&
            data.query_result.rows &&
            data.query_result.rows.length > 0
          ) {
            const maxStakingApr = data.query_result.rows[0].apr_max_btc;
            setStakingStats(prevStats => ({
              ...prevStats,
              maxStakingApr,
            }));
          }
        } else {
          throw new Error('Failed to fetch data from the API');
        }
      } catch (error) {
        console.error('Error fetching max staking APR:', error);
      }
    }
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
