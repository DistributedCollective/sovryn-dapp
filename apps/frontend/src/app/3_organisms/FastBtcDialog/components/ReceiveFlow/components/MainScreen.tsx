import React, { useCallback, useContext } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { DepositContext } from '../../../contexts/deposit-context';
import { Instructions } from '../../Instructions';

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
      <Instructions isReceive />

      {addressError && <div>{addressError}</div>}

      {fastBtcLocked ? (
        <div>{t(translations.maintenanceMode.fastBtc)}</div>
      ) : (
        <Button
          disabled={!account || !ready || addressLoading}
          onClick={onContinueClick}
          className="w-full"
          style={ButtonStyle.secondary}
          text={t(translations.common.buttons.continue)}
        />
      )}
    </div>
  );
};
