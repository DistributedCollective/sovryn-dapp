import React, { useCallback, useContext } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle, ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import {
  ReceiveFlowContext,
  ReceiveFlowStep,
} from '../../../contexts/receiveflow';
import { Instructions } from '../../Instructions';

export const InitialScreen: React.FC = () => {
  const { account } = useAccount();
  const { set } = useContext(ReceiveFlowContext);
  const erc20BridgeLocked = false;
  const onContinueClick = useCallback(() => {
    set(prevState => ({ ...prevState, step: ReceiveFlowStep.MAIN }));
  }, [set]);

  return (
    <div>
      <Instructions />

      {erc20BridgeLocked ? (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.erc20Bridge)}
        />
      ) : (
        <Button
          disabled={!account}
          onClick={onContinueClick}
          text={t(translations.common.buttons.continue)}
          className="w-full"
          style={ButtonStyle.secondary}
          dataAttribute="funding-receive-instructions-confirm"
        />
      )}
    </div>
  );
};
