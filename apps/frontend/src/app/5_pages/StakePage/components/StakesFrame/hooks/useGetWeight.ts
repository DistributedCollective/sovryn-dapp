import { useCallback, useEffect, useMemo, useState } from 'react';

import { MS } from '../../../../../../constants/general';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../../../utils/chain';
import { useGetLockDate } from './useGetLockDate';

export const useGetWeight = (unlockDate: number) => {
  const stakingContract = useGetProtocolContract('staking', getRskChainId());
  const [weight, setWeight] = useState(0);
  const currentDate = useMemo(() => Math.ceil(new Date().getTime() / MS), []);

  const { lockDate } = useGetLockDate(currentDate);

  const getWeight = useCallback(async () => {
    if (unlockDate < lockDate || !stakingContract) {
      return;
    }

    const weight = await stakingContract?.computeWeightByDate(
      unlockDate,
      lockDate,
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
