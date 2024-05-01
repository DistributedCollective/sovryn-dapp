import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { Button, ButtonType, ButtonStyle, Tooltip } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../../../config/chains';

import { TransactionType } from '../../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { MS } from '../../../../../../../constants/general';
import { useTransactionContext } from '../../../../../../../contexts/TransactionContext';
import { useAssetBalance } from '../../../../../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../../../../hooks/useGetContract';
import { useMaintenance } from '../../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../../../utils/asset';
import { decimalic } from '../../../../../../../utils/math';
import { MAX_LIQUID_STAKES } from '../../Staking.constants';
import useGetFilteredDates from '../../hooks/useGetFilteredDates';
import useGetVestingAddresses from '../../hooks/useGetVestingAddresses';

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
  const currentDate = useMemo(() => Math.ceil(new Date().getTime() / MS), []);
  const vestingAddresses = useGetVestingAddresses();
  const filteredDates = useGetFilteredDates(vestingAddresses);

  const datesLessThanCurrentTime = useMemo(
    () =>
      filteredDates.filter(
        dateInSeconds => parseInt(dateInSeconds) < currentDate,
      ),
    [filteredDates, currentDate],
  );

  const isAboveThreshold = useMemo(
    () =>
      datesLessThanCurrentTime.length > MAX_LIQUID_STAKES &&
      vestingAddresses.length > 0,
    [datesLessThanCurrentTime, vestingAddresses],
  );
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const { checkMaintenance, States } = useMaintenance();
  const claimLiquidSovLocked = checkMaintenance(States.CLAIM_LIQUID_SOV);
  const rewardsLocked = checkMaintenance(States.REWARDS_FULL);

  const chainId = useCurrentChain();
  const stakingRewards = useGetProtocolContract('stakingRewards', chainId);
  const tokenBalance = useAssetBalance(
    COMMON_SYMBOLS.SOV,
    RSK_CHAIN_ID,
    stakingRewards?.address,
  );

  const hasTokenBalance = useMemo(
    () => tokenBalance.bigNumberBalance.gte(amountToClaim),
    [amountToClaim, tokenBalance],
  );

  const isClaimDisabled = useMemo(
    () =>
      isAboveThreshold ||
      claimLiquidSovLocked ||
      !hasTokenBalance ||
      rewardsLocked ||
      decimalic(amountToClaim).isZero(),
    [
      amountToClaim,
      claimLiquidSovLocked,
      hasTokenBalance,
      rewardsLocked,
      isAboveThreshold,
    ],
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
    <Tooltip
      children={
        <div>
          <Button
            type={ButtonType.button}
            style={ButtonStyle.secondary}
            text={t(translations.rewardPage.stabilityPool.actions.withdraw)}
            onClick={onSubmit}
            disabled={isClaimDisabled}
            className="w-full lg:w-auto"
            dataAttribute="liquid-button"
          />
        </div>
      }
      content={t(translations.rewardPage.staking.liquidityMiningError, {
        count: MAX_LIQUID_STAKES,
      })}
      dataAttribute="liquid-button-tooltip"
      className="inline-block"
      disabled={!isAboveThreshold}
    />
  );
};
