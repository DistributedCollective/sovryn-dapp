import React, { useCallback } from 'react';

import {
  WithdrawBoltzContext,
  WithdrawBoltzStep,
} from '../../contexts/withdraw-boltz-context';
import { useWithdrawBoltzConfig } from '../../hooks/useWithdrawBoltzConfig';
import { GoBackButton } from '../GoBackButton';
import { MobileCloseButton } from '../MobileCloseButton';
import { AmountForm } from './components/AmountForm';
import { ConfirmationScreens } from './components/ConfirmationScreens';
import { InvoiceForm } from './components/InvoiceForm';
import { MainScreen } from './components/MainScreen';

const allowedStepsToGoBackFrom = [
  WithdrawBoltzStep.AMOUNT,
  WithdrawBoltzStep.INVOICE,
  WithdrawBoltzStep.REVIEW,
];

const getBackStep = (step: WithdrawBoltzStep) => {
  switch (step) {
    case WithdrawBoltzStep.AMOUNT:
      return WithdrawBoltzStep.MAIN;
    case WithdrawBoltzStep.INVOICE:
      return WithdrawBoltzStep.AMOUNT;
    case WithdrawBoltzStep.REVIEW:
      return WithdrawBoltzStep.INVOICE;
    default:
      return WithdrawBoltzStep.AMOUNT;
  }
};

type SendFlowProps = {
  onClose: () => void;
};

export const BoltzSendFlow: React.FC<SendFlowProps> = ({ onClose }) => {
  const value = useWithdrawBoltzConfig();
  const { step, set } = value;

  const onBackClick = useCallback(() => {
    if (step === WithdrawBoltzStep.REVIEW) {
      if (localStorage.getItem('submarine-swap')) {
        if (
          window.confirm('Going back will clear the current swap. Continue?')
        ) {
          localStorage.removeItem('submarine-swap');
          set(prevState => ({
            ...prevState,
            step: getBackStep(step),
            invoice: '',
            amount: '',
            hash: '',
            swap: undefined,
          }));
        } else {
          return;
        }
      }
    }
    set(prevState => ({ ...prevState, step: getBackStep(step) }));
  }, [set, step]);

  return (
    <WithdrawBoltzContext.Provider value={value}>
      {allowedStepsToGoBackFrom.includes(step) && (
        <GoBackButton onClick={onBackClick} />
      )}

      <div className="mt-0 md:mt-12">
        {step === WithdrawBoltzStep.MAIN && <MainScreen />}
        {step === WithdrawBoltzStep.AMOUNT && <AmountForm />}
        {step === WithdrawBoltzStep.INVOICE && <InvoiceForm />}
        {[
          WithdrawBoltzStep.REVIEW,
          WithdrawBoltzStep.CONFIRM,
          WithdrawBoltzStep.PROCESSING,
          WithdrawBoltzStep.COMPLETED,
        ].includes(step) && <ConfirmationScreens onClose={onClose} />}
      </div>

      <MobileCloseButton onClick={onClose} dataAttribute="funding-close" />
    </WithdrawBoltzContext.Provider>
  );
};
