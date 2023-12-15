import React, { useCallback } from 'react';

import { WithdrawStep } from '../../contexts/withdraw-context';
import { useWithdrawBridgeConfig } from '../../hooks/useWithdrawBridgeConfig';
import { GoBackButton } from '../GoBackButton';
import { MobileCloseButton } from '../MobileCloseButton';
import { AddressForm } from './components/AddressForm';
import { AmountForm } from './components/AmountForm';
import { ConfirmationScreens } from './components/ConfirmationScreens';
import { MainScreen } from './components/MainScreen';
import { WithdrawBoltzContext } from '../../contexts/withdraw-boltz-context';

const allowedStepsToGoBackFrom = [
  WithdrawStep.AMOUNT,
  WithdrawStep.ADDRESS,
  WithdrawStep.REVIEW,
];

const getBackStep = (step: WithdrawStep) => {
  switch (step) {
    case WithdrawStep.AMOUNT:
      return WithdrawStep.MAIN;
    case WithdrawStep.ADDRESS:
      return WithdrawStep.AMOUNT;
    case WithdrawStep.REVIEW:
      return WithdrawStep.ADDRESS;
    default:
      return WithdrawStep.AMOUNT;
  }
};

type SendFlowProps = {
  onClose: () => void;
};

export const BoltzSendFlow: React.FC<SendFlowProps> = ({ onClose }) => {
  const value = useWithdrawBridgeConfig();
  const { step, set } = value;

  const onBackClick = useCallback(() => {
    set(prevState => ({ ...prevState, step: getBackStep(step) }));
  }, [set, step]);

  return (
    <WithdrawBoltzContext.Provider value={value}>
      {allowedStepsToGoBackFrom.includes(step) && (
        <GoBackButton onClick={onBackClick} />
      )}

      <div className="mt-0 md:mt-12">
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

      <MobileCloseButton onClick={onClose} dataAttribute="funding-close" />
    </WithdrawBoltzContext.Provider>
  );
};
