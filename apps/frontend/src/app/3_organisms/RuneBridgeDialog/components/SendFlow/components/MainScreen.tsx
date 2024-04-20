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
