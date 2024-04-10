import { useCallback, useEffect, useRef, useState } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';
import { areAddressesEqual } from '../../../../../../utils/helpers';
import { fromWei } from '../../../../../../utils/math';
import { StakeItem } from '../StakesFrame.types';

export const useGetStakes = () => {
  const { account } = useAccount();
  const chainId = useCurrentChain();
  const stakingContract = useGetProtocolContract('staking', chainId);
  const [stakes, setStakes] = useState<StakeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { value: block } = useBlockNumber();
  const prevBlockRef = useRef<number | undefined>(block);

  const updateStakes = useCallback(async () => {
    if (!stakingContract || !account) {
      return;
    }

    try {
      setLoading(true);
      const result = await asyncCall(
        `staking/stakes/${account}`,
        () => stakingContract.getStakes(account),
        { force: true },
      );

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
      }
    } catch (error) {
      console.error('Error fetching stakes:', error);
    } finally {
      setLoading(false);
    }
  }, [stakingContract, account]);

  useEffect(() => {
    if (!account) {
      setStakes([]);
      return;
    }

    if (prevBlockRef.current !== block || account) {
      updateStakes();
    }

    prevBlockRef.current = block;
  }, [block, account, updateStakes]);

  return { stakes, loading, refetch: updateStakes };
};
