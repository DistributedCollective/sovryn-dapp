import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

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
import { useBlockNumber } from '../../../../../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../../locales/i18n';
import { useCheckPoolBlocked } from '../../../../hooks/useCheckPoolBlocked';
import { useCheckPoolMaintenance } from '../../../../hooks/useCheckPoolMaintenance';
import { useGetUserInfo } from '../../../../hooks/useGetUserInfo';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { AdjustAndDepositModal } from '../../../AdjustAndDepositModal/AdjustAndDepositModal';

type PoolsTableActionProps = {
  pool: AmmLiquidityPool;
};

export const PoolsTableAction: FC<PoolsTableActionProps> = ({ pool }) => {
  const { account } = useAccount();
  const { value: block } = useBlockNumber();

  const { checkMaintenance, States } = useMaintenance();
  const poolLocked = useCheckPoolMaintenance(pool);
  const poolBlocked = useCheckPoolBlocked(pool);

  const {
    balanceA: poolBalanceA,
    balanceB: poolBalanceB,
    refetch,
  } = useGetUserInfo(pool);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialDeposit, setIsInitialDeposit] = useState(true);

  const actionLocked = useMemo(
    () => checkMaintenance(States.D2_MARKET_MAKING_FULL) || poolLocked,
    [States.D2_MARKET_MAKING_FULL, checkMaintenance, poolLocked],
  );

  const handleDepositClick = useCallback(() => {
    if (actionLocked || poolBlocked.isBlocked) {
      return;
    }
    setIsInitialDeposit(true);
    setIsModalOpen(true);
  }, [actionLocked, poolBlocked.isBlocked]);

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

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  return (
    <div className="flex flex-col items-center lg:items-end gap-1.5 w-full">
      <div className="flex items-center justify-center lg:justify-end w-full">
        <Tooltip
          trigger={TooltipTrigger.click}
          content={<>{t(translations.maintenanceMode.featureDisabled)}</>}
          disabled={!actionLocked}
          children={
            <>
              {!account ||
              (poolBalanceA.lte(Decimal.ZERO) &&
                poolBalanceB.lte(Decimal.ZERO)) ? (
                poolBlocked.isBlocked ? (
                  <Tooltip
                    children={
                      <div>
                        <Button
                          style={ButtonStyle.primary}
                          size={ButtonSize.small}
                          text={t(translations.common.deposit)}
                          dataAttribute="pools-table-deposit-button"
                          className="w-full lg:w-auto prevent-row-click"
                          disabled
                        />
                      </div>
                    }
                    content={
                      poolBlocked.message ??
                      t(
                        translations.marketMakingPage.marketMakingOperations
                          .depositNotAllowed,
                      )
                    }
                    dataAttribute="pools-table-deposit-button-tooltip"
                    className="w-full lg:w-auto prevent-row-click"
                  />
                ) : (
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
                )
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
            </>
          }
        />
      </div>

      <AdjustAndDepositModal
        isOpen={isModalOpen}
        onClose={handleClose}
        pool={pool}
        isInitialDeposit={isInitialDeposit}
      />
    </div>
  );
};
