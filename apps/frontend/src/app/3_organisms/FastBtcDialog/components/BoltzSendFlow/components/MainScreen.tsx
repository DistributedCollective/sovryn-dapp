import React, { useCallback, useContext, useEffect } from 'react';

import { t } from 'i18next';

import { Button, ButtonStyle, ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import {
  WithdrawBoltzContext,
  WithdrawBoltzStep,
} from '../../../contexts/withdraw-boltz-context';
import { SubmarineSwapResponse } from '../../../utils/boltz/boltz.types';
import { Instructions } from './Instructions';

export const MainScreen: React.FC = () => {
  const { account } = useAccount();
  const { set } = useContext(WithdrawBoltzContext);

  const { checkMaintenance, States } = useMaintenance();
  const boltzLocked = checkMaintenance(States.BOLTZ_SEND);

  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: WithdrawBoltzStep.AMOUNT })),
    [set],
  );

  useEffect(() => {
    const swap = localStorage.getItem('submarine-swap');

    if (swap) {
      try {
        const data: {
          swap: SubmarineSwapResponse;
          amount: string;
          invoice: string;
        } = JSON.parse(swap);
        set(prevState => ({
          ...prevState,
          amount: data.amount,
          step: WithdrawBoltzStep.REVIEW,
          swap: data.swap,
          invoice: data.invoice,
        }));
      } catch (error) {}
    }
  }, [set]);

  return (
    <div>
      <Instructions />

      {boltzLocked ? (
        <ErrorBadge
          level={ErrorLevel.Warning}
          message={t(translations.maintenanceMode.boltz)}
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
