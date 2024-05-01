import { useCallback, useEffect, useMemo, useState } from 'react';

import { MS } from '../../../../../../constants/general';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';
import { useGetLockDate } from './useGetLockDate';

export const useGetWeight = (unlockDate: number) => {
  const chainId = useCurrentChain();
  const stakingContract = useGetProtocolContract('staking', chainId);
  const [weight, setWeight] = useState(1);
  const currentDate = useMemo(() => Math.ceil(new Date().getTime() / MS), []);

  const { lockDate } = useGetLockDate(currentDate);

  const getWeight = useCallback(async () => {
    if (!stakingContract || unlockDate < lockDate) {
      return;
    }

    const weight = await asyncCall(
      `staking/weights/${unlockDate}/${lockDate}`,
      () => stakingContract?.computeWeightByDate(unlockDate, lockDate),
    );
    setWeight(Number(weight));
  }, [unlockDate, lockDate, stakingContract]);

  useEffect(() => {
    if (unlockDate !== 0 && lockDate !== 0) {
      getWeight();
    }
  }, [unlockDate, lockDate, getWeight]);

  return { weight };
};
