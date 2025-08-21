import { useCallback, useEffect, useMemo, useState } from 'react';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { useLoadContract } from '../../../../../../hooks/useLoadContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';
import { toWei } from '../../../../../../utils/math';

export const useCloseWithDepositIsTinyPosition = (
  loanId: string,
  depositAmount: string,
) => {
  const contract = useLoadContract('protocol', 'protocol', RSK_CHAIN_ID);
  const [isTinyPosition, setIsTinyPosition] = useState(false);

  const isValidDepositAmount = useMemo(
    () => depositAmount !== '0' && depositAmount !== '',
    [depositAmount],
  );

  const weiAmount = useMemo(
    () => (isValidDepositAmount ? toWei(depositAmount) : '0'),
    [depositAmount, isValidDepositAmount],
  );

  const fetchResult = useCallback(async () => {
    if (!contract) {
      return;
    }

    const result = await asyncCall(
      `closeWithDeposit/tinyAmount/${loanId}/${weiAmount}`,
      () => contract.checkCloseWithDepositIsTinyPosition(loanId, weiAmount),
    );

    if (result) {
      setIsTinyPosition(result.isTinyPosition);
    }
  }, [contract, loanId, weiAmount]);

  useEffect(() => {
    if (isValidDepositAmount) {
      fetchResult();
    }
  }, [fetchResult, depositAmount, isValidDepositAmount]);

  return isTinyPosition;
};
