import { useCallback, useContext } from 'react';

import { ReceiveFlowContext } from '../contexts/receiveflow';
import { useContractService } from './useContractService';

export const useReceiveFlowService = () => {
  const {
    step,
    set,
    errorMessage,
    depositTx,
    txCheckingAttempts,
    requestLastScannedBlock,
    getRuneDepositStatus,
  } = useContext(ReceiveFlowContext);
  const { requestDepositAddress } = useContractService();
  const requestDepositAddressCallback = useCallback(async () => {
    return await requestDepositAddress();
  }, [requestDepositAddress]);

  return {
    step,
    set,
    depositTx,
    errorMessage,
    txCheckingAttempts,
    requestDepositAddressCallback,
    requestLastScannedBlock,
    getRuneDepositStatus,
  };
};
