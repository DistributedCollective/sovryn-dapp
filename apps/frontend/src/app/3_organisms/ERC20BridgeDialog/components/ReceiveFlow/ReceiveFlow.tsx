import React, { useCallback } from 'react';

import { GoBackButton } from '../../../../1_atoms/GoBackButton/GoBackButton';
import { Stepper } from '../../../../1_atoms/Stepper/Stepper';
import {
  ReceiveFlowStep,
  useReceiveFlowContext,
} from '../../contexts/receiveflow';
import { AmountScreen } from './components/AmountScreen';
import { InitialScreen } from './components/InitialScreen';
import { MainScreen } from './components/MainScreen';
import { ReviewScreen } from './components/ReviewScreen';

type ReceiveFlowProps = {
  onClose: () => void;
};

const allowedStepsToGoBackFrom = [
  ReceiveFlowStep.MAIN,
  ReceiveFlowStep.AMOUNT,
  ReceiveFlowStep.REVIEW,
];

const getBackStep = (step: ReceiveFlowStep) => {
  switch (step) {
    case ReceiveFlowStep.MAIN:
      return ReceiveFlowStep.INITIAL;
    case ReceiveFlowStep.AMOUNT:
      return ReceiveFlowStep.MAIN;
    case ReceiveFlowStep.REVIEW:
      return ReceiveFlowStep.AMOUNT;
    default:
      return ReceiveFlowStep.AMOUNT;
  }
};

export const ReceiveFlow: React.FC<ReceiveFlowProps> = () => {
  const { set, step } = useReceiveFlowContext();
  const onBackClick = useCallback(() => {
    set(prevState => ({ ...prevState, step: getBackStep(step) }));
  }, [set, step]);

  return (
    <>
      {allowedStepsToGoBackFrom.includes(step) && (
        <GoBackButton onClick={onBackClick} />
      )}

      {step !== ReceiveFlowStep.INITIAL && (
        <Stepper className="mt-6" steps={4} activeStep={step} />
      )}

      <div className="mt-0 md:mt-10">
        {step === ReceiveFlowStep.INITIAL && <InitialScreen />}
        {step === ReceiveFlowStep.MAIN && <MainScreen />}
        {step === ReceiveFlowStep.AMOUNT && <AmountScreen />}
        {step === ReceiveFlowStep.REVIEW && <ReviewScreen />}
      </div>
    </>
  );
};
