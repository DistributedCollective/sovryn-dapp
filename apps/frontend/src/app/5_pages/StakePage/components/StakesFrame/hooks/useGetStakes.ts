import { useCallback, useEffect, useState } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../../../utils/chain';
import { areAddressesEqual } from '../../../../../../utils/helpers';
import { fromWei } from '../../../../../../utils/math';
import { StakeItem } from '../StakesFrame.types';

export const useGetStakes = () => {
  const { account } = useAccount();
  const stakingContract = useGetProtocolContract('staking', getRskChainId());
  const [stakes, setStakes] = useState<StakeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const updateStakes = useCallback(async () => {
    if (!stakingContract || isDataFetched) {
      return;
    }

    setLoading(true);
    try {
      const result = await stakingContract.getStakes(account);
      if (result) {
        const { stakes, dates } = result;

        const stakesArray = await Promise.all(
          dates.map(async (unlockDate: number, index: number) => {
            const delegate = await stakingContract.delegates(
              account,
              unlockDate,
            );

            return {
              stakedAmount: fromWei(stakes[index]),
              unlockDate: Number(unlockDate),
              delegate: areAddressesEqual(delegate, account) ? '' : delegate,
            };
          }),
        );

        setStakes(stakesArray);
        setIsDataFetched(true);
      }
    } catch (error) {
      console.error('Error fetching stakes:', error);
    } finally {
      setLoading(false);
    }
  }, [stakingContract, account, isDataFetched]);

  useEffect(() => {
    if (account) {
      updateStakes();
    } else {
      setStakes([]);
      setIsDataFetched(false);
    }
  }, [updateStakes, account]);

  return { stakes, loading };
};
