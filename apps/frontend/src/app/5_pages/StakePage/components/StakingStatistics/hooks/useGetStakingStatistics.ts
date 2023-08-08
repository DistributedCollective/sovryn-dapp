import { useCallback, useEffect, useMemo, useState } from 'react';

import { MS } from '../../../../../../constants/general';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { MAX_STAKING_APR_API_LINK } from '../../../StakePage.constants';

const REDASH_API_KEY = process.env.REACT_APP_REDASH_API_KEY;

export const useGetStakingStatistics = () => {
  const currentDate = useMemo(() => new Date(), []);
  const stakingContract = useGetProtocolContract('staking');
  const [stakingStats, setStakingStats] = useState({
    totalStakedSov: 0,
    totalVotingPower: 0,
    maxStakingApr: 0,
  });
  const { value: block } = useBlockNumber();

  const fetchStakingStatistics = useCallback(async () => {
    if (!stakingContract) {
      return;
    }
    const fetchData = async () => {
      const timestamp = Math.ceil(currentDate.getTime() / MS);
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
    };

    const fetchMaxStakingApr = async () => {
      if (!REDASH_API_KEY) {
        return;
      }

      try {
        const response = await fetch(
          `${MAX_STAKING_APR_API_LINK}?api_key=${REDASH_API_KEY}`,
        );

        if (response.ok) {
          const data = await response.json();
          if (
            data &&
            data.query_result &&
            data.query_result.data.rows &&
            data.query_result.data.rows.length > 0
          ) {
            const maxStakingApr = data.query_result.data.rows[0].apr_max_btc;
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
    };

    if (block > 0 && stakingContract) {
      if (
        stakingStats.totalStakedSov === 0 ||
        stakingStats.totalVotingPower === 0
      ) {
        await fetchData();
      }

      await fetchMaxStakingApr();
    }
  }, [
    stakingContract,
    block,
    stakingStats.totalStakedSov,
    stakingStats.totalVotingPower,
    currentDate,
  ]);

  useEffect(() => {
    fetchStakingStatistics();
  }, [fetchStakingStatistics]);

  return stakingStats;
};
