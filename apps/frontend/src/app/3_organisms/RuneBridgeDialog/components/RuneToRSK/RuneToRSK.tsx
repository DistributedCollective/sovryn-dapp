import React, { useCallback } from 'react';

import { StatusScreen } from '../../../FastBtcDialog/components/ReceiveFlow/components/StatusScreen';
import { ReceiveflowStep } from '../../contexts/receiveflow';
import { useReceiveFlowService } from '../../hooks/useReceiveFlowService';
import { GoBackButton } from '../GoBackButton';
import { AddressForm } from './components/AddressForm';
import { MainScreen } from './components/MainScreen';

interface RuneToRSKProps {
  onClose: () => void;
}

export const RuneToRSK: React.FC<RuneToRSKProps> = ({ onClose }) => {
  const { step, set } = useReceiveFlowService();
  const onBackClick = useCallback(() => {
    set(prevState => ({ ...prevState, step: ReceiveflowStep.MAIN }));
  }, [set]);

  return (
    <div>
      {step === ReceiveflowStep.ADDRESS && (
        <GoBackButton onClick={onBackClick} />
      )}

      <div className="mt-0 md:mt-12">
        {step === ReceiveflowStep.MAIN && <MainScreen />}

        {step === ReceiveflowStep.ADDRESS && <AddressForm />}
        {[ReceiveflowStep.PROCESSING, ReceiveflowStep.COMPLETED].includes(
          step,
        ) && <StatusScreen onClose={onClose} />}
      </div>
    </div>
  );
};
