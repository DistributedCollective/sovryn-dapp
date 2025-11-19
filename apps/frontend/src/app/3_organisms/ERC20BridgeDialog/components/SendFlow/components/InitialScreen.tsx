import React, { useCallback, useContext } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle, ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { SendFlowContext, SendFlowStep } from '../../../contexts/sendflow';
import { useERC20BridgeLocked } from '../../../hooks/useERC20BridgeLocked';
import { Instructions } from '../../Instructions';

export const InitialScreen: React.FC = () => {
  const { account } = useAccount();
  const { set } = useContext(SendFlowContext);
  const isBridgeLocked = useERC20BridgeLocked();
  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: SendFlowStep.MAIN })),
    [set],
  );

  return (
    <div>
      <Instructions />

      {isBridgeLocked ? (
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
          dataAttribute="funding-send-instructions-confirm"
        />
      )}
    </div>
  );
};
