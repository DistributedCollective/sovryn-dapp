import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { Button, ButtonType, ButtonStyle } from '@sovryn/ui';

import { TransactionType } from '../../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../../contexts/TransactionContext';
import { useGetProtocolContract } from '../../../../../../../hooks/useGetContract';
import { useMaintenance } from '../../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../utils/math';

type WithdrawLiquidOsFeeProps = {
  amountToClaim: string;
  nextWithdrawTimestamp: number;
  refetch: () => void;
};

export const WithdrawLiquidOsFee: FC<WithdrawLiquidOsFeeProps> = ({
  amountToClaim,
  nextWithdrawTimestamp,
  refetch,
}) => {
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const { checkMaintenance, States } = useMaintenance();
  const claimLiquidSovLocked = checkMaintenance(States.CLAIM_LIQUID_SOV);
  const rewardsLocked = checkMaintenance(States.REWARDS_FULL);

  const stakingRewards = useGetProtocolContract('stakingRewardsOs');

  const isClaimDisabled = useMemo(
    () =>
      claimLiquidSovLocked ||
      rewardsLocked ||
      decimalic(amountToClaim).isZero(),
    [amountToClaim, claimLiquidSovLocked, rewardsLocked],
  );

  const onComplete = useCallback(() => {
    refetch();
  }, [refetch]);

  const onSubmit = useCallback(() => {
    if (!stakingRewards) {
      return;
    }

    const title = t(translations.rewardPage.stabilityPool.tx.withdrawGains);
    const txTitle = t(translations.rewardPage.stabilityPool.tx.withdraw);

    setTransactions([
      {
        title,
        request: {
          type: TransactionType.signTransaction,
          contract: stakingRewards,
          fnName: 'collectReward',
          args: [nextWithdrawTimestamp],
          gasLimit: GAS_LIMIT.REWARDS_OS_FEE,
        },
        onComplete,
      },
    ]);
    setTitle(txTitle);
    setIsOpen(true);
  }, [
    nextWithdrawTimestamp,
    onComplete,
    setIsOpen,
    setTitle,
    setTransactions,
    stakingRewards,
  ]);

  return (
    <Button
      type={ButtonType.button}
      style={ButtonStyle.secondary}
      text={t(translations.rewardPage.stabilityPool.actions.withdraw)}
      onClick={onSubmit}
      disabled={isClaimDisabled}
      className="w-full lg:w-auto inline-block"
      dataAttribute="liquid-os-button"
    />
  );
};
