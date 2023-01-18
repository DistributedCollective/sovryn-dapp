import React, { useCallback, useContext } from 'react';

import { Button } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { DepositContext } from '../../../contexts/deposit-context';

export const MainScreen: React.FC = () => {
  const { account } = useAccount();
  const { ready, requestDepositAddress, addressLoading, addressError } =
    useContext(DepositContext);

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC);

  const onContinueClick = useCallback(
    () => requestDepositAddress(account),
    [requestDepositAddress, account],
  );

  return (
    <div>
      <div>TBD: Instructions</div>

      {addressError && <div>{addressError}</div>}

      {fastBtcLocked ? (
        <div>Fast BTC is locked</div>
      ) : (
        <Button
          disabled={!account || !ready || addressLoading}
          onClick={onContinueClick}
          text="Continue"
        />
      )}
    </div>
  );
};
