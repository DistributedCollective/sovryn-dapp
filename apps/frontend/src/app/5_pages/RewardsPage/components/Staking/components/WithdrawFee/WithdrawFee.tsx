import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Button, ButtonType, ButtonStyle } from '@sovryn/ui';

import {
  Transaction,
  TransactionType,
} from '../../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../../hooks/useGetContract';
import { useMaintenance } from '../../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../../locales/i18n';
import { getMaxProcessableCheckpoints } from '../../../../../../../utils/helpers';
import { decimalic } from '../../../../../../../utils/math';
import { EarnedFee } from '../../../../RewardsPage.types';
import { useGetNextPositiveCheckpoint } from '../../../../hooks/useGetNextPositiveCheckpoint';
import { useGetTotalTokenCheckpoints } from '../../../../hooks/useGetTotalTokenCheckpoints';

type WithdrawFeeProps = EarnedFee & {
  refetch: () => void;
};

export const WithdrawFee: FC<WithdrawFeeProps> = ({
  token,
  value,
  contractAddress,
  refetch,
}) => {
  const { account } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const { checkMaintenance, States } = useMaintenance();
  const claimFeesEarnedLocked = checkMaintenance(States.CLAIM_FEES_EARNED);
  const rewardsLocked = checkMaintenance(States.REWARDS_FULL);

  const isRBTC = useMemo(() => token === SupportedTokens.rbtc, [token]);

  const feeSharing = useGetProtocolContract('feeSharing');

  const { maxCheckpoints } = useGetTotalTokenCheckpoints(contractAddress);
  const { userCheckpoint, updateNextPositiveCheckpoint } =
    useGetNextPositiveCheckpoint(contractAddress, Number(maxCheckpoints));

  const isClaimDisabled = useMemo(
    () =>
      !userCheckpoint?.hasFees ||
      claimFeesEarnedLocked ||
      rewardsLocked ||
      decimalic(value).lte(0),
    [userCheckpoint?.hasFees, claimFeesEarnedLocked, rewardsLocked, value],
  );

  const maxWithdrawCheckpoint = useMemo(
    () =>
      Number(maxCheckpoints) > getMaxProcessableCheckpoints(token)
        ? String(getMaxProcessableCheckpoints(token))
        : maxCheckpoints,
    [maxCheckpoints, token],
  );

  const onComplete = useCallback(() => {
    updateNextPositiveCheckpoint();
    refetch();
  }, [refetch, updateNextPositiveCheckpoint]);

  const onSubmit = useCallback(() => {
    if (!feeSharing) {
      return;
    }

    const transactions: Transaction[] = [];
    const title = t(translations.rewardPage.stabilityPool.tx.withdrawGains);
    const txTitle = t(translations.rewardPage.stabilityPool.tx.withdraw);

    if (userCheckpoint?.hasSkippedCheckpoints) {
      if (isRBTC) {
        transactions.push({
          title,
          request: {
            type: TransactionType.signTransaction,
            contract: feeSharing,
            fnName: 'withdrawRBTCStartingFromCheckpoint',
            args: [
              userCheckpoint?.checkpointNum,
              maxWithdrawCheckpoint,
              account,
            ],
          },
          onComplete,
        });
      } else {
        transactions.push({
          title,
          request: {
            type: TransactionType.signTransaction,
            contract: feeSharing,
            fnName: 'withdrawStartingFromCheckpoint',
            args: [
              contractAddress,
              userCheckpoint?.checkpointNum,
              maxWithdrawCheckpoint,
              account,
            ],
          },
          onComplete,
        });
      }
    } else {
      if (isRBTC) {
        transactions.push({
          title,
          request: {
            type: TransactionType.signTransaction,
            contract: feeSharing,
            fnName: 'withdrawRBTC',
            args: [maxWithdrawCheckpoint, account],
          },
          onComplete,
        });
      } else {
        transactions.push({
          title,
          request: {
            type: TransactionType.signTransaction,
            contract: feeSharing,
            fnName: 'withdraw',
            args: [contractAddress, maxWithdrawCheckpoint, account],
          },
          onComplete,
        });
      }
    }

    setTransactions(transactions);
    setTitle(txTitle);
    setIsOpen(true);
  }, [
    account,
    contractAddress,
    feeSharing,
    isRBTC,
    maxWithdrawCheckpoint,
    onComplete,
    setIsOpen,
    setTitle,
    setTransactions,
    userCheckpoint?.checkpointNum,
    userCheckpoint?.hasSkippedCheckpoints,
  ]);

  return (
    <Button
      type={ButtonType.button}
      style={ButtonStyle.secondary}
      text={t(translations.rewardPage.stabilityPool.actions.withdraw)}
      onClick={onSubmit}
      disabled={isClaimDisabled}
      className="w-full lg:w-auto"
      dataAttribute="rewards-withdraw"
    />
  );
};
