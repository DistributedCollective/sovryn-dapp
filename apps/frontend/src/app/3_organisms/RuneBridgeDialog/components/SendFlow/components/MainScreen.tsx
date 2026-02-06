import React, { useCallback, useContext } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle, ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { SendFlowContext, SendFlowStep } from '../../../contexts/sendflow';
import { useRuneBridgeLocked } from '../../../hooks/useRuneBridgeLocked';
import { Instructions } from '../../Instructions';

export const MainScreen: React.FC = () => {
  const { account } = useAccount();
  const { set } = useContext(SendFlowContext);
  const runeBridgeLocked = useRuneBridgeLocked();
  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: SendFlowStep.AMOUNT })),
    [set],
  );
  return (
    <div>
      <Instructions />

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
    </div>
  );
};
