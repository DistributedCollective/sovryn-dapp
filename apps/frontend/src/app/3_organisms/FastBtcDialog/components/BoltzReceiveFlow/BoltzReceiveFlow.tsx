import React, { useCallback } from 'react';

import { GoBackButton } from '../../../../1_atoms/GoBackButton/GoBackButton';
import { MobileCloseButton } from '../../../../1_atoms/MobileCloseButton/MobileCloseButton';
import {
  DepositBoltzContext,
  DepositBoltzStep,
} from '../../contexts/deposit-boltz-context';
import { useDepositBoltzConfig } from '../../hooks/useDepositBoltzConfig';
import { AmountForm } from './components/AmountForm';
import { ConfirmationScreens } from './components/ConfirmationScreens';
import { MainScreen } from './components/MainScreen';

const allowedStepsToGoBackFrom = [
  DepositBoltzStep.AMOUNT,
  DepositBoltzStep.REVIEW,
];

const getBackStep = (step: DepositBoltzStep) => {
  switch (step) {
    case DepositBoltzStep.AMOUNT:
      return DepositBoltzStep.MAIN;
    case DepositBoltzStep.REVIEW:
      return DepositBoltzStep.AMOUNT;
    default:
      return DepositBoltzStep.AMOUNT;
  }
};

type ReceiveFlowProps = {
  onClose: () => void;
};

export const BoltzReceiveFlow: React.FC<ReceiveFlowProps> = ({ onClose }) => {
  const value = useDepositBoltzConfig();
  const { step, set } = value;

  const onBackClick = useCallback(() => {
    set(prevState => ({ ...prevState, step: getBackStep(step) }));
  }, [set, step]);

  return (
    <DepositBoltzContext.Provider value={value}>
      {allowedStepsToGoBackFrom.includes(step) && (
        <GoBackButton onClick={onBackClick} />
      )}

      <div className="mt-0 md:mt-4">
        {step === DepositBoltzStep.MAIN && <MainScreen />}
        {step === DepositBoltzStep.AMOUNT && <AmountForm />}
        {step === DepositBoltzStep.REVIEW && (
          <ConfirmationScreens onClose={onClose} />
        )}
      </div>

      <MobileCloseButton onClick={onClose} dataAttribute="funding-close" />
    </DepositBoltzContext.Provider>
  );
};
