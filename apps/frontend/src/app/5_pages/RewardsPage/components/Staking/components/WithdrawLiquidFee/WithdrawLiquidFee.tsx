import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';

import { Button, ButtonType, ButtonStyle } from '@sovryn/ui';

import { TransactionType } from '../../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../../../../../contexts/TransactionContext';
import {
  useGetProtocolContract,
  useGetTokenContract,
} from '../../../../../../../hooks/useGetContract';
import { useMaintenance } from '../../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../utils/math';

type WithdrawLiquidFeeProps = {
  amountToClaim: string;
  lastWithdrawalInterval?: number;
  refetch: () => void;
};

export const WithdrawLiquidFee: FC<WithdrawLiquidFeeProps> = ({
  amountToClaim,
  lastWithdrawalInterval,
  refetch,
}) => {
  const [tokenBalance, setTokenBalance] = useState('');
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const { checkMaintenance, States } = useMaintenance();
  const claimLiquidSovLocked = checkMaintenance(States.CLAIM_LIQUID_SOV);
  const rewardsLocked = checkMaintenance(States.REWARDS_FULL);

  const stakingRewards = useGetProtocolContract('stakingRewards');
  const sovToken = useGetTokenContract('sov');

  useEffect(() => {
    if (!sovToken || !stakingRewards) {
      return;
    }

    (async () => {
      const balance = await sovToken.balanceOf(stakingRewards?.address);
      setTokenBalance(balance.toString());
    })();
  }, [sovToken, stakingRewards]);

  const hasTokenBalance = useMemo(() => {
    return decimalic(tokenBalance).gte(amountToClaim);
  }, [amountToClaim, tokenBalance]);

  const isClaimDisabled = useMemo(
    () => claimLiquidSovLocked || !hasTokenBalance || rewardsLocked,
    [claimLiquidSovLocked, hasTokenBalance, rewardsLocked],
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
          args: [lastWithdrawalInterval],
        },
        onComplete,
      },
    ]);
    setTitle(txTitle);
    setIsOpen(true);
  }, [
    lastWithdrawalInterval,
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
      dataAttribute="liquid-button"
    />
  );
};
