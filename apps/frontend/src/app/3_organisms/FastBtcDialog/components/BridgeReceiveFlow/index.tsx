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
import { AssetList } from './components/AssetList';
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

  const value = useMemo(
    () => ({
      ...state,
      set: setState,
    }),
    [state],
  );

  const content = useMemo(() => {
    switch (state.step) {
      case ReceiveStep.MAIN:
        return <NetworkList />;
      case ReceiveStep.BITCOIN_FLOW:
        return <ReceiveFlow onClose={onClose} />;
      case ReceiveStep.SELECT_ASSET:
        return <AssetList />;
    }
  }, [onClose, state.step]);

  const onBackClick = useCallback(() => {
    value.set(prevState => ({ ...prevState, step: getBackStep(value.step) }));
  }, [value]);

  return (
    <ReceiveContext.Provider value={value}>
      {allowedStepsToGoBackFrom.includes(value.step) && (
        <GoBackButton onClick={onBackClick} />
      )}
      <div className="mt-0 md:mt-12">{content}</div>
      <MobileCloseButton onClick={onClose} dataAttribute="funding-close" />
    </ReceiveContext.Provider>
  );
};
