import React, { useCallback, useMemo, useState } from 'react';

import {
  ReceiveContext,
  ReceiveContextStateType,
  ReceiveStep,
  defaultValue,
} from '../../contexts/receive-context';
import { GoBackButton } from '../GoBackButton';
import { MobileCloseButton } from '../MobileCloseButton';
import { ReceiveFlow } from '../ReceiveFlow/ReceiveFlow';
import { AmountForm } from './components/AmountForm';
import { AssetList } from './components/AssetList';
import { DetailsScreen } from './components/DetailsScreen';
import { NetworkList } from './components/NetworkList';

type ReceiveFlowProps = {
  onClose: () => void;
};

const allowedStepsToGoBackFrom = [
  ReceiveStep.SELECT_ASSET,
  ReceiveStep.AMOUNT,
  ReceiveStep.DETAILS,
];

const getBackStep = (step: ReceiveStep) => {
  switch (step) {
    case ReceiveStep.SELECT_ASSET:
      return ReceiveStep.MAIN;
    case ReceiveStep.AMOUNT:
      return ReceiveStep.SELECT_ASSET;
    case ReceiveStep.DETAILS:
      return ReceiveStep.AMOUNT;
    default:
      return ReceiveStep.MAIN;
  }
};

export const BridgeReceiveFlow: React.FC<ReceiveFlowProps> = ({ onClose }) => {
  const [state, setState] = useState<ReceiveContextStateType>(defaultValue);
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

  return (
    <ReceiveContext.Provider value={value}>
      {step === ReceiveStep.BITCOIN_FLOW ? (
        <ReceiveFlow onClose={onClose} onBack={onBackClick} />
      ) : (
        <>
          {allowedStepsToGoBackFrom.includes(value.step) && (
            <GoBackButton onClick={onBackClick} />
          )}
          <div className="mt-0 md:mt-12">
            {step === ReceiveStep.MAIN && <NetworkList />}
            {step === ReceiveStep.SELECT_ASSET && <AssetList />}
            {step === ReceiveStep.AMOUNT && <AmountForm />}
            {step === ReceiveStep.DETAILS && (
              <DetailsScreen onConfirm={handleConfirm} />
            )}
          </div>
          <MobileCloseButton onClick={onClose} dataAttribute="funding-close" />
        </>
      )}
    </ReceiveContext.Provider>
  );
};
