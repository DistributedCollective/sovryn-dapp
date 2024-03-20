import React, { useCallback } from 'react';

import { SendFlowStep } from '../../contexts/sendflow';
import { useSendFlowService } from '../../hooks/useSendFlowService';
import { GoBackButton } from '../GoBackButton';
import { AddressForm } from './components/AddressForm';
import { AmountForm } from './components/AmountForm';
import { ConfirmationScreens } from './components/ConfirmationScreens';
import { MainScreen } from './components/MainScreen';

interface RSKToRuneProps {
  onClose: () => void;
}

const allowedStepsToGoBackFrom = [
  SendFlowStep.AMOUNT,
  SendFlowStep.ADDRESS,
  SendFlowStep.REVIEW,
];

const getBackStep = (step: SendFlowStep) => {
  switch (step) {
    case SendFlowStep.AMOUNT:
      return SendFlowStep.MAIN;
    case SendFlowStep.ADDRESS:
      return SendFlowStep.AMOUNT;
    case SendFlowStep.REVIEW:
      return SendFlowStep.ADDRESS;
    default:
      return SendFlowStep.AMOUNT;
  }
};

export const RSKToRune: React.FC<RSKToRuneProps> = ({ onClose }) => {
  const { set, step } = useSendFlowService();
  const onBackClick = useCallback(() => {
    set(prevState => ({ ...prevState, step: getBackStep(step) }));
  }, [set, step]);

  return (
    <>
      {allowedStepsToGoBackFrom.includes(step) && (
        <GoBackButton onClick={onBackClick} />
      )}
      <div className="mt-0 md:mt-12">
        {step === SendFlowStep.MAIN && <MainScreen />}
        {step === SendFlowStep.AMOUNT && <AmountForm />}
        {step === SendFlowStep.ADDRESS && <AddressForm />}
        {[
          SendFlowStep.REVIEW,
          SendFlowStep.CONFIRM,
          SendFlowStep.PROCESSING,
          SendFlowStep.COMPLETED,
        ].includes(step) && <ConfirmationScreens onClose={onClose} />}
      </div>
    </>
  );
};
