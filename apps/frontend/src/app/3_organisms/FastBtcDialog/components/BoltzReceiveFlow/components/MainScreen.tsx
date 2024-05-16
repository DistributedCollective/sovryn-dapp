import React, { useCallback, useContext, useEffect } from 'react';

import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import { Button, ButtonStyle, ErrorBadge, ErrorLevel } from '@sovryn/ui';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../locales/i18n';
import { ReverseSwap } from '../../../../Boltz/Boltz.type';
import {
  DepositBoltzContext,
  DepositBoltzStep,
} from '../../../contexts/deposit-boltz-context';
import { Instructions } from './Instructions';

export const MainScreen: React.FC = () => {
  const { account } = useAccount();
  const { set } = useContext(DepositBoltzContext);

  const { checkMaintenance, States } = useMaintenance();
  const boltzLocked = checkMaintenance(States.BOLTZ_RECEIVE);

  const onContinueClick = useCallback(
    () => set(prevState => ({ ...prevState, step: DepositBoltzStep.AMOUNT })),
    [set],
  );

  useEffect(() => {
    const swap = localStorage.getItem('reverse-swap');

    if (swap) {
      try {
        const swapData: ReverseSwap = JSON.parse(swap);

        set(prevState => ({
          ...prevState,
          amount: formatUnits(swapData.sendAmount, 8),
          step: DepositBoltzStep.REVIEW,
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
