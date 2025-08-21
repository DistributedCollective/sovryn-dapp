import { useCallback, useEffect, useMemo, useState } from 'react';

import { MS } from '../../../../../../constants/general';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { Environments } from '../../../../../../types/global';
import { isMainnet } from '../../../../../../utils/helpers';
import { REDASH_APR_URL } from '../../../StakePage.constants';

const redashAprUrl = isMainnet()
  ? REDASH_APR_URL[Environments.Mainnet]
  : REDASH_APR_URL[Environments.Testnet];

export const useGetStakingStatistics = () => {
  const currentDate = useMemo(() => new Date(), []);
  const chainId = useCurrentChain();
  const stakingContract = useGetProtocolContract('staking', chainId);
  const [stakingStats, setStakingStats] = useState({
    totalVotingPower: 0,
    maxStakingApr: 0,
  });
  const { value: block } = useBlockNumber(chainId);

  const fetchStakingStatistics = useCallback(async () => {
    if (!stakingContract) {
      return;
    }
    const fetchData = async () => {
      const timestamp = Math.ceil(currentDate.getTime() / MS);
      const votingPowerAmount = await stakingContract.getPriorTotalVotingPower(
        block - 1,
        timestamp,
      );

      if (votingPowerAmount) {
        setStakingStats(prevStats => ({
          ...prevStats,
          totalVotingPower: votingPowerAmount,
        }));
      }
    };

    const fetchMaxStakingApr = async () => {
      try {
        const response = await fetch(redashAprUrl);

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
      if (stakingStats.totalVotingPower === 0) {
        await fetchData();
      }

      await fetchMaxStakingApr();
    }
  }, [stakingContract, block, stakingStats.totalVotingPower, currentDate]);

  useEffect(() => {
    fetchStakingStatistics();
  }, [fetchStakingStatistics]);

  return stakingStats;
};
