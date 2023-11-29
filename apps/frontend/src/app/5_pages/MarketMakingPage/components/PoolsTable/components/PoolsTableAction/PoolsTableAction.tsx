import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  ButtonStyle,
  ButtonSize,
  Button,
  Tooltip,
  TooltipTrigger,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { useAccount } from '../../../../../../../hooks/useAccount';
import { useMaintenance } from '../../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../../locales/i18n';
import { useCheckPoolMaintenance } from '../../../../hooks/useCheckPoolMaintenance';
import { useGetUserInfo } from '../../../../hooks/useGetUserInfo';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { AdjustAndDepositModal } from '../../../AdjustAndDepositModal/AdjustAndDepositModal';

type PoolsTableActionProps = {
  pool: AmmLiquidityPool;
};

export const PoolsTableAction: FC<PoolsTableActionProps> = ({ pool }) => {
  const { account } = useAccount();

  const { checkMaintenance, States } = useMaintenance();
  const poolLocked = useCheckPoolMaintenance(pool);

  const { balanceA: poolBalance } = useGetUserInfo(pool);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialDeposit, setIsInitialDeposit] = useState(true);

  const actionLocked = useMemo(
    () => checkMaintenance(States.D2_MARKET_MAKING_FULL) || poolLocked,
    [States.D2_MARKET_MAKING_FULL, checkMaintenance, poolLocked],
  );

  const handleDepositClick = useCallback(() => {
    if (actionLocked) {
      return;
    }
    setIsInitialDeposit(true);
    setIsModalOpen(true);
  }, [actionLocked]);

  const handleAdjustClick = useCallback(() => {
    if (actionLocked) {
      return;
    }
    setIsInitialDeposit(false);
    setIsModalOpen(true);
  }, [actionLocked]);

  const handleClose = useCallback(() => {
    setIsInitialDeposit(true);
    setIsModalOpen(false);
  }, []);

  return (
    <div className="flex items-center justify-center lg:justify-end">
      <Tooltip
        trigger={TooltipTrigger.click}
        content={<>{t(translations.maintenanceMode.featureDisabled)}</>}
        disabled={!actionLocked}
        children={
          <div>
            {!account || poolBalance.lte(Decimal.ZERO) ? (
              <Button
                style={ButtonStyle.primary}
                size={ButtonSize.small}
                text={t(translations.common.deposit)}
                dataAttribute="pools-table-deposit-button"
                className="w-full lg:w-auto prevent-row-click"
                disabledStyle={actionLocked}
                disabled={!account}
                onClick={handleDepositClick}
              />
            ) : (
              <Button
                style={ButtonStyle.secondary}
                size={ButtonSize.small}
                text={t(translations.common.adjust)}
                dataAttribute="pools-table-adjust-button"
                className="w-full lg:w-auto prevent-row-click"
                disabledStyle={actionLocked}
                disabled={!account}
                onClick={handleAdjustClick}
              />
            )}
          </div>
        }
      />

      <AdjustAndDepositModal
        isOpen={isModalOpen}
        onClose={handleClose}
        pool={pool}
        isInitialDeposit={isInitialDeposit}
      />
    </div>
  );
};
