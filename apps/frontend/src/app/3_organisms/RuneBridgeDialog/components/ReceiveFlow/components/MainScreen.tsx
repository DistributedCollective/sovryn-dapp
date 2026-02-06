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

      <ErrorBadge
        level={ErrorLevel.Warning}
        message={
          <>
            <p>
              We're sunsetting the Runes Bridge and closing the Runes pools as
              we move away from Runes support on Sovryn.
            </p>
            <p>
              If you have assets on the bridge, please withdraw them by 27
              February 2026. You can use the Runes Bridge to move your assets
              back to Bitcoin before the deadline and they'll return as native
              Runes. After this date, assets will remain accessible but will be
              locked to their specific chain.
            </p>
          </>
        }
        className="mb-6"
      />

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
