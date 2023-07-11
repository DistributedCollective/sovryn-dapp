import { useCallback, useEffect, useState } from 'react';

import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../utils/chain';
import { fromWei, toWei } from '../../../../utils/math';

export const useGetPenaltyAmount = (amount: string, unlockDate: number) => {
  const stakingContract = useGetProtocolContract('staking', getRskChainId());
  const [penaltyAmount, setPenaltyAmount] = useState('0');

  const getPenaltyAmount = useCallback(async () => {
    try {
      if (Number(amount) > 0 && unlockDate && stakingContract) {
        const receivedAmount = await stakingContract.getWithdrawAmounts(
          toWei(amount),
          unlockDate,
        );
        if (receivedAmount) {
          setPenaltyAmount(fromWei(receivedAmount[1]).toString());
        }
      }
    } catch (error) {
      console.error('Error getting penalty amount:', error);
    }
  }, [stakingContract, amount, unlockDate]);

  useEffect(() => {
    getPenaltyAmount();
  }, [getPenaltyAmount]);

  return penaltyAmount;
};
