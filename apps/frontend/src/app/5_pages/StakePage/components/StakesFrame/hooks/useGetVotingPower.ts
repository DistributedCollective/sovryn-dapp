import { useCallback, useEffect, useState } from 'react';

import { WEIGHT_FACTOR } from '../../../../../../constants/general';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../../../utils/chain';

export const useGetVotingPower = (stakedAmount: string, unlockDate: number) => {
  const [weight, setWeight] = useState(0);
  const [lockDate, setLockDate] = useState(0);
  const [votingPower, setVotingPower] = useState(0);
  const { account } = useAccount();
  const timestamp = Math.round(new Date().getTime() / 1e3);
  const stakingContract = useGetProtocolContract('staking', getRskChainId());

  const getLockDate = useCallback(async () => {
    const date = await stakingContract?.timestampToLockDate(timestamp);
    setLockDate(date);
  }, [stakingContract, timestamp]);

  const getWeight = useCallback(async () => {
    if (Number(unlockDate) < Number(lockDate)) return;
    const weight = await stakingContract?.computeWeightByDate(
      unlockDate,
      lockDate,
    );
    setWeight(weight);
  }, [unlockDate, lockDate, stakingContract]);

  useEffect(() => {
    if (account && stakingContract && timestamp && lockDate === 0) {
      getLockDate();
    }
  }, [account, stakingContract, timestamp, lockDate, getLockDate]);

  useEffect(() => {
    if (lockDate !== 0 && weight === 0) {
      getWeight();
    }
  }, [lockDate, weight, getWeight]);

  useEffect(() => {
    if (WEIGHT_FACTOR && weight !== 0) {
      setVotingPower((Number(stakedAmount) * Number(weight)) / WEIGHT_FACTOR);
    }
  }, [stakedAmount, weight]);

  return votingPower;
};
