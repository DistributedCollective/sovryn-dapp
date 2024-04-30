import React, { useCallback } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle, ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { ReceiveflowStep } from '../../../contexts/receiveflow';
import { useReceiveFlowContext } from '../../../contexts/receiveflow';
import { useRequestDepositAddress } from '../../../hooks/useRequestDepositAddress';
import { useRuneBridgeLocked } from '../../../hooks/useRuneBridgeLocked';
import { Instructions } from '../../Instructions';

export const MainScreen: React.FC = () => {
  const { account } = useAccount();
  const requestDepositAddress = useRequestDepositAddress();
  const { errorMessage, set } = useReceiveFlowContext();

  const runeBridgeLocked = useRuneBridgeLocked();
  const onContinueClick = useCallback(async () => {
    await requestDepositAddress()
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
  }, [requestDepositAddress, set]);
  return (
    <div>
      <Instructions isReceive />

      {runeBridgeLocked ? (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.runeBridge)}
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
