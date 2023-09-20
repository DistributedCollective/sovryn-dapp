import React, { FC, useCallback, useMemo } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import { SupportedTokens, getProtocolContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Button, ButtonType, ButtonStyle } from '@sovryn/ui';

import { defaultChainId } from '../../../../../../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../../hooks/useGetContract';
import { useMaintenance } from '../../../../../../../hooks/useMaintenance';
import { translations } from '../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../utils/math';
import { EarnedFee } from '../../../../RewardsPage.types';

type WithdrawFeeProps = {
  fees: EarnedFee[];
  refetch: () => void;
};

const MAX_CHECKPOINTS = 10;
const MAX_NEXT_POSITIVE_CHECKPOINT = 75;

export const WithdrawAllFees: FC<WithdrawFeeProps> = ({ fees, refetch }) => {
  const { account } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const { checkMaintenance, States } = useMaintenance();
  const claimFeesEarnedLocked = checkMaintenance(States.CLAIM_FEES_EARNED);
  const rewardsLocked = checkMaintenance(States.REWARDS_FULL);

  const feeSharing = useGetProtocolContract('feeSharing');

  const isClaimDisabled = useMemo(
    () =>
      claimFeesEarnedLocked ||
      rewardsLocked ||
      fees.every(({ value }) => decimalic(value).lte(0)),
    [claimFeesEarnedLocked, fees, rewardsLocked],
  );

  const onComplete = useCallback(() => {
    refetch();
  }, [refetch]);

  const onSubmit = useCallback(async () => {
    if (!feeSharing) {
      return;
    }

    const claimable = fees.filter(fee => decimalic(fee.value).gt(0));

    // TODO: it might be not needed to fetch checkpoints when SC is updated.
    // START: Fetch checkpoints
    const checkpoints = await Promise.all(
      claimable.map(fee =>
        getNextPositiveCheckpoint(account, fee).then(result => ({
          ...fee,
          startFrom: result.checkpointNum,
          hasSkippedCheckpoints: result.hasSkippedCheckpoints,
          hasFees: result.hasFees,
        })),
      ),
    ).then(result => result.filter(fee => fee.hasSkippedCheckpoints));

    console.log({ checkpoints });

    if (checkpoints.length === 0) {
      // todo: show error message about impossibility to withdraw
      console.warn('No checkpoints to withdraw');
      return;
    }

    // END: Fetch checkpoints

    const transactions: Transaction[] = [];
    const title = t(translations.rewardPage.stabilityPool.tx.withdrawGains);
    const txTitle = t(translations.rewardPage.stabilityPool.tx.withdraw);

    transactions.push({
      title,
      request: {
        type: TransactionType.signTransaction,
        contract: feeSharing,
        fnName: 'withdrawStartingFromCheckpoints',
        args: [
          claimable.map(({ contractAddress }) => contractAddress),
          claimable.map(({ startFrom }) => startFrom),
          MAX_CHECKPOINTS,
          account,
        ],
        gasLimit: GAS_LIMIT.REWARDS_CLAIM,
      },
      onComplete,
    });

    setTransactions(transactions);
    setTitle(txTitle);
    setIsOpen(true);
  }, [
    account,
    feeSharing,
    fees,
    onComplete,
    setIsOpen,
    setTitle,
    setTransactions,
  ]);

  return (
    <Button
      type={ButtonType.button}
      style={ButtonStyle.secondary}
      text={t(translations.rewardPage.stabilityPool.actions.withdrawAll)}
      onClick={onSubmit}
      disabled={isClaimDisabled}
      className="w-full lg:w-auto whitespace-nowrap"
      dataAttribute="rewards-withdraw"
    />
  );
};

type UserCheckpoint = {
  token: SupportedTokens;
  checkpointNum: number;
  hasFees: boolean;
  hasSkippedCheckpoints: boolean;
};

let feeSharingContract: Contract;
const getFeeSharingContract = async () => {
  if (!feeSharingContract) {
    feeSharingContract = (
      await getProtocolContract('feeSharing', defaultChainId)
    ).contract(getProvider(defaultChainId));
  }
  return feeSharingContract;
};

async function getNextPositiveCheckpoint(
  owner: string,
  fee: EarnedFee,
): Promise<UserCheckpoint> {
  let userNextUnprocessedCheckpoint = fee.startFrom || 0;
  while (userNextUnprocessedCheckpoint < (fee.maxCheckpoints || 0)) {
    const { hasFees, checkpointNum, hasSkippedCheckpoints } = await (
      await getFeeSharingContract()
    ).getNextPositiveUserCheckpoint(
      owner,
      fee.contractAddress,
      userNextUnprocessedCheckpoint,
      MAX_NEXT_POSITIVE_CHECKPOINT,
    );

    userNextUnprocessedCheckpoint = Number(checkpointNum);

    if (!!hasFees) {
      return {
        token: fee.token,
        checkpointNum: Number(checkpointNum),
        hasFees,
        hasSkippedCheckpoints,
      };
    }
  }

  return {
    token: fee.token,
    checkpointNum: 0,
    hasFees: false,
    hasSkippedCheckpoints: false,
  };
}
