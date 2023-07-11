import { useEffect, useState } from 'react';

import { WEIGHT_FACTOR } from '../../../../constants/general';
import { useGetWeight } from '../components/StakesFrame/hooks/useGetWeight';

export const useGetVotingPower = (stakedAmount: string, unlockDate: number) => {
  const [votingPower, setVotingPower] = useState(0);
  const { weight } = useGetWeight(unlockDate);

  useEffect(() => {
    if (weight && stakedAmount) {
      setVotingPower((Number(stakedAmount) * Number(weight)) / WEIGHT_FACTOR);
    }
  }, [stakedAmount, weight]);

  return votingPower;
};
