import React, { useCallback } from 'react';

import { GoBackButton } from '../../../../1_atoms/GoBackButton/GoBackButton';
import { Stepper } from '../../../../1_atoms/Stepper/Stepper';
import { SendFlowStep, useSendFlowContext } from '../../contexts/sendflow';
import { AmountScreen } from './components/AmountScreen';
import { InitialScreen } from './components/InitialScreen';
import { MainScreen } from './components/MainScreen';
import { ReviewScreen } from './components/ReviewScreen';

type SendFlowProps = {
  onClose: () => void;
};

const allowedStepsToGoBackFrom = [
  SendFlowStep.MAIN,
  SendFlowStep.AMOUNT,
  SendFlowStep.REVIEW,
];

const getBackStep = (step: SendFlowStep) => {
  switch (step) {
    case SendFlowStep.MAIN:
      return SendFlowStep.INITIAL;
    case SendFlowStep.AMOUNT:
      return SendFlowStep.MAIN;
    case SendFlowStep.REVIEW:
      return SendFlowStep.AMOUNT;
    default:
      return SendFlowStep.AMOUNT;
  }
};

export const SendFlow: React.FC<SendFlowProps> = () => {
  const { set, step } = useSendFlowContext();
  const onBackClick = useCallback(() => {
    set(prevState => ({ ...prevState, step: getBackStep(step) }));
  }, [set, step]);

  return (
    <>
      {allowedStepsToGoBackFrom.includes(step) && (
        <GoBackButton onClick={onBackClick} />
      )}

      {step !== SendFlowStep.INITIAL && (
        <Stepper className="mt-6" steps={4} activeStep={step} />
      )}

      <div className="mt-0 md:mt-10">
        {step === SendFlowStep.INITIAL && <InitialScreen />}
        {step === SendFlowStep.MAIN && <MainScreen />}
        {step === SendFlowStep.AMOUNT && <AmountScreen />}
        {[
          SendFlowStep.REVIEW,
          SendFlowStep.PROCESSING,
          SendFlowStep.COMPLETED,
        ].includes(step) && <ReviewScreen />}
      </div>
    </>
  );
};
