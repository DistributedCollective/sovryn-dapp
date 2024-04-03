import React, { useCallback } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle, ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { ReceiveflowStep } from '../../../contexts/receiveflow';
import { useReceiveFlowService } from '../../../hooks/useReceiveFlowService';
import { Instructions } from '../../Instructions';

export const MainScreen: React.FC = () => {
  const { account } = useAccount();
  const { requestDepositAddressCallback, errorMessage, set } =
    useReceiveFlowService();

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC_SEND);
  const onContinueClick = useCallback(async () => {
    await requestDepositAddressCallback()
      .then(() => {
        set(prevState => ({
          ...prevState,
          step: ReceiveflowStep.ADDRESS,
          errorMessage: null,
        }));
      })
      .catch(e => {
        set(prevState => ({ ...prevState, errorMessage: String(e) }));
      });
  }, [requestDepositAddressCallback, set]);
  return (
    <div>
      <Instructions isReceive />

      {fastBtcLocked ? (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.fastBtc)}
        />
      ) : (
        <Button
          disabled={!account}
          onClick={onContinueClick}
          text={t(translations.common.buttons.continue)}
          className="w-full"
          style={ButtonStyle.secondary}
          dataAttribute="funding-send-instructions-confirm"
        />
      )}
      {errorMessage && (
        <ErrorBadge level={ErrorLevel.Critical} message={errorMessage} />
      )}
    </div>
  );
};
