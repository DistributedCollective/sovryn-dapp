import { useEffect, useState } from 'react';

import { WEIGHT_FACTOR } from '../StakePage.constants';
import { useGetWeight } from '../components/StakesFrame/hooks/useGetWeight';

export const useGetVotingPower = (
  currentBalance: string,
  unlockDate: number,
) => {
  const [votingPower, setVotingPower] = useState(0);
  const { weight } = useGetWeight(unlockDate);
  console.log('votingPower', votingPower);

  useEffect(() => {
    if (weight && currentBalance) {
      setVotingPower((Number(currentBalance) * Number(weight)) / WEIGHT_FACTOR);
    }
  }, [currentBalance, weight]);

  return votingPower;
};
