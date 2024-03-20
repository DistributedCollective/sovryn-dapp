import { useContext } from 'react';

import { ReceiveFlowContext, ReceiveflowStep } from '../contexts/receiveflow';
import { useContractService } from './useContractService';

export const useReceiveFlowService = () => {
  const { step, set } = useContext(ReceiveFlowContext);
  const { requestDepositAddress } = useContractService();
  const requestDepositAddressCallback = async () => {
    await requestDepositAddress();
    set(prevState => ({ ...prevState, step: ReceiveflowStep.ADDRESS }));
  };
  return {
    step,
    set,
    requestDepositAddressCallback,
  };
};
