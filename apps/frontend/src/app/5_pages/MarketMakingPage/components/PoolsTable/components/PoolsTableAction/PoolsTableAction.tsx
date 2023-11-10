import React, { FC, useCallback, useState } from 'react';

import { t } from 'i18next';

import { ButtonStyle, ButtonSize, Button } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { AdjustAndDepositModal } from '../../../AdjustAndDepositModal/AdjustAndDepositModal';

// TODO: Fetch pool balance in the component. If you want to test the adjust functionality, set it to Decimal.ONE
const poolBalance = Decimal.ZERO; // Decimal.ONE

type PoolsTableActionProps = {
  pool: AmmLiquidityPool;
};

export const PoolsTableAction: FC<PoolsTableActionProps> = ({ pool }) => {
  const { account } = useAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialDeposit, setIsInitialDeposit] = useState(true);

  const handleDepositClick = useCallback(() => {
    setIsInitialDeposit(true);
    setIsModalOpen(true);
  }, []);

  const handleAdjustClick = useCallback(() => {
    setIsInitialDeposit(false);
    setIsModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsInitialDeposit(true);
    setIsModalOpen(false);
  }, []);

  return (
    <div className="flex items-center justify-center lg:justify-end">
      {!account || poolBalance.lte(Decimal.ZERO) ? (
        <Button
          style={ButtonStyle.primary}
          size={ButtonSize.small}
          text={t(translations.common.deposit)}
          dataAttribute="pools-table-deposit-button"
          className="w-full lg:w-auto prevent-row-click"
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
          disabled={!account}
          onClick={handleAdjustClick}
        />
      )}

      <AdjustAndDepositModal
        isOpen={isModalOpen}
        onClose={handleClose}
        pool={pool}
        isInitialDeposit={isInitialDeposit}
      />
    </div>
  );
};
