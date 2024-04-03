import { useContext } from 'react';

import { ReceiveFlowContext } from '../contexts/receiveflow';
import { useContractService } from './useContractService';

export const useReceiveFlowService = () => {
  const { step, set, errorMessage } = useContext(ReceiveFlowContext);
  const { requestDepositAddress } = useContractService();
  const requestDepositAddressCallback = async () => {
    return await requestDepositAddress();
  };
  return {
    step,
    set,
    errorMessage,
    requestDepositAddressCallback,
  };
};
