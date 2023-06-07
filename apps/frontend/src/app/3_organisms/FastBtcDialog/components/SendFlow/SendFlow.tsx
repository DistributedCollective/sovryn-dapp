import React, { useCallback } from 'react';

import { WithdrawContext, WithdrawStep } from '../../contexts/withdraw-context';
import { useWithdrawBridgeConfig } from '../../hooks/useWithdrawBridgeConfig';
import { GoBackButton } from '../GoBackButton';
import { MobileCloseButton } from '../MobileCloseButton';
import { AddressForm } from './components/AddressForm';
import { AmountForm } from './components/AmountForm';
import { ConfirmationScreens } from './components/ConfirmationScreens';
import { MainScreen } from './components/MainScreen';
import { NetworkScreen } from './components/NetworkScreen';
import { SenderAssetScreen } from './components/SenderAssetScreen';

const allowedStepsToGoBackFrom = [
  WithdrawStep.NETWORK,
  WithdrawStep.SENDER_ASSET,
  WithdrawStep.RECIPIENT_ASSET,
  WithdrawStep.AMOUNT,
  WithdrawStep.ADDRESS,
  WithdrawStep.REVIEW,
];

const getBackStep = (step: WithdrawStep) => {
  switch (step) {
    case WithdrawStep.NETWORK:
      return WithdrawStep.MAIN;
    case WithdrawStep.SENDER_ASSET:
      return WithdrawStep.NETWORK;
    case WithdrawStep.RECIPIENT_ASSET:
      return WithdrawStep.SENDER_ASSET;
    case WithdrawStep.AMOUNT:
      return WithdrawStep.NETWORK;
    case WithdrawStep.ADDRESS:
      return WithdrawStep.AMOUNT;
    case WithdrawStep.REVIEW:
      return WithdrawStep.ADDRESS;
    default:
      return WithdrawStep.NETWORK;
  }
};

type SendFlowProps = {
  onClose: () => void;
};

export const SendFlow: React.FC<SendFlowProps> = ({ onClose }) => {
  const value = useWithdrawBridgeConfig();
  const { step, set } = value;

  const onBackClick = useCallback(() => {
    set(prevState => ({ ...prevState, step: getBackStep(step) }));
  }, [set, step]);

  return (
    <WithdrawContext.Provider value={value}>
      {allowedStepsToGoBackFrom.includes(step) && (
        <GoBackButton onClick={onBackClick} />
      )}

      <div className="mt-0 md:mt-12">
        {step === WithdrawStep.MAIN && <MainScreen />}
        {step === WithdrawStep.NETWORK && <NetworkScreen />}
        {step === WithdrawStep.SENDER_ASSET && <SenderAssetScreen />}
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
    </WithdrawContext.Provider>
  );
};
