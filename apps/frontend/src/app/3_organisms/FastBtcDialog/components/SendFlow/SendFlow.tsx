import React from 'react';

import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { useWithdrawBridgeConfig } from '../../hooks/useWithdrawBridgeConfig';
import { AddressForm } from './components/AddressForm';
import { AmountForm } from './components/AmountForm';
import { ConfirmationScreens } from './components/ConfirmationScreens';
import { MainScreen } from './components/MainScreen';

type SendFlowProps = {
  onClose: () => void;
};

export const SendFlow: React.FC<SendFlowProps> = ({ onClose }) => {
  const value = useWithdrawBridgeConfig();
  const { step } = value;

  return (
    <WithdrawContext.Provider value={value}>
      <div>
        {step === WithdrawStep.MAIN && <MainScreen />}
        {step === WithdrawStep.AMOUNT && <AmountForm />}
        {step === WithdrawStep.ADDRESS && <AddressForm />}
        {[
          WithdrawStep.REVIEW,
          WithdrawStep.CONFIRM,
          WithdrawStep.PROCESSING,
          WithdrawStep.COMPLETED,
        ].includes(step) && <ConfirmationScreens onClose={onClose} />}
      </div>
    </WithdrawContext.Provider>
  );
};
