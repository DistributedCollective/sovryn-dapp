import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ChainIds } from '@sovryn/ethers-provider';

import { defaultChainId } from '../../../../../config/chains';

import { useNetworkContext } from '../../../../../contexts/NetworkContext';
import {
  SendContextStateType,
  SendStep,
  defaultValue,
  SendContext,
} from '../../contexts/send-context';
import { GoBackButton } from '../GoBackButton';
import { MobileCloseButton } from '../MobileCloseButton';
import { SendFlow } from '../SendFlow/SendFlow';
import { AddressForm } from './components/AddressForm';
import { AmountForm } from './components/AmountForm';
import { DetailsScreen } from './components/DetailsScreen';
import { NetworkScreen } from './components/NetworkScreen';
import { RecipientAssetScreen } from './components/RecipientAssetScreen';
import { SenderAssetScreen } from './components/SenderAssetScreen';

type SendFlowProps = {
  onClose: () => void;
};

const allowedStepsToGoBackFrom = [
  SendStep.SENDER_ASSET,
  SendStep.RECIPIENT_ASSET,
  SendStep.NETWORK,
  SendStep.ADDRESS,
  SendStep.AMOUNT,
  SendStep.DETAILS,
];

const getBackStep = (step: SendStep) => {
  switch (step) {
    case SendStep.NETWORK:
      return SendStep.MAIN;
    case SendStep.ADDRESS:
      return SendStep.NETWORK;
    case SendStep.SENDER_ASSET:
      return SendStep.ADDRESS;
    case SendStep.RECIPIENT_ASSET:
      return SendStep.SENDER_ASSET;
    case SendStep.AMOUNT:
      return SendStep.RECIPIENT_ASSET;
    case SendStep.DETAILS:
      return SendStep.AMOUNT;
    default:
      return SendStep.MAIN;
  }
};

export const BridgeSendFlow: React.FC<SendFlowProps> = ({ onClose }) => {
  const { requireChain } = useNetworkContext();
  const [state, setState] = useState<SendContextStateType>(defaultValue);
  const { step } = state;

  const value = useMemo(
    () => ({
      ...state,
      set: setState,
    }),
    [state],
  );

  const onBackClick = useCallback(() => {
    value.set(prevState => ({ ...prevState, step: getBackStep(value.step) }));
  }, [value]);

  const handleConfirm = useCallback(() => {}, []);

  useEffect(() => {
    return () => {
      requireChain(defaultChainId as ChainIds);
    };
  }, [requireChain]);

  return (
    <SendContext.Provider value={value}>
      {step === SendStep.BITCOIN_FLOW ? (
        <SendFlow onClose={onClose} onBack={onBackClick} />
      ) : (
        <>
          {allowedStepsToGoBackFrom.includes(value.step) && (
            <GoBackButton onClick={onBackClick} />
          )}
          <div className="mt-0 md:mt-12">
            {(step === SendStep.MAIN || step === SendStep.NETWORK) && (
              <NetworkScreen />
            )}
            {step === SendStep.ADDRESS && <AddressForm />}
            {step === SendStep.SENDER_ASSET && <SenderAssetScreen />}
            {step === SendStep.RECIPIENT_ASSET && <RecipientAssetScreen />}
            {step === SendStep.AMOUNT && <AmountForm />}
            {step === SendStep.DETAILS && (
              <DetailsScreen onConfirm={handleConfirm} />
            )}
          </div>
          <MobileCloseButton onClick={onClose} dataAttribute="funding-close" />
        </>
      )}
    </SendContext.Provider>
  );
};
