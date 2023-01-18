import React, { useCallback, useContext } from 'react';

import { Button } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import {
  WithdrawContext,
  WithdrawStep,
} from '../../../contexts/withdraw-context';

export const MainScreen: React.FC = () => {
  const { account } = useAccount();
  const { set } = useContext(WithdrawContext);

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: WithdrawStep.AMOUNT })),
    [set],
  );

  return (
    <div>
      <div>TBD: Instructions</div>

      {fastBtcLocked ? (
        <div>Fast BTC is locked</div>
      ) : (
        <Button disabled={!account} onClick={onContinueClick} text="Continue" />
      )}
    </div>
  );
};
