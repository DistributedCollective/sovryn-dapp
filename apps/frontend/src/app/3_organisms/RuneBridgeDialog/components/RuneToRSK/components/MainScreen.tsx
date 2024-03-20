import React, { useCallback } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle, ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { useReceiveFlowService } from '../../../hooks/useReceiveFlowService';
import { Instructions } from '../../Instructions';

export const MainScreen: React.FC = () => {
  const { account } = useAccount();
  const { requestDepositAddressCallback } = useReceiveFlowService();

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC_SEND);
  const onContinueClick = useCallback(async () => {
    await requestDepositAddressCallback();
  }, [requestDepositAddressCallback]);
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
    </div>
  );
};
