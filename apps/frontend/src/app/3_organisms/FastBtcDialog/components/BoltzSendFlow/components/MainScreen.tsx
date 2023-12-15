import React, { useCallback, useContext } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle, ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { WithdrawStep } from '../../../contexts/withdraw-context';
import { WithdrawBoltzContext } from '../../../contexts/withdraw-boltz-context';
import { Instructions } from './Instructions';

export const MainScreen: React.FC = () => {
  const { account } = useAccount();
  const { set } = useContext(WithdrawBoltzContext);

  const { checkMaintenance, States } = useMaintenance();
  const fastBtcLocked = checkMaintenance(States.FASTBTC_SEND);

  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: WithdrawStep.AMOUNT })),
    [set],
  );

  return (
    <div>
      <Instructions />

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
