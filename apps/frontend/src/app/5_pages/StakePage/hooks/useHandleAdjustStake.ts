import { useCallback } from 'react';

import { constants } from 'ethers';
import { t } from 'i18next';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { translations } from '../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../utils/asset';
import { toWei } from '../../../../utils/math';
import { prepareApproveTransaction } from '../../../../utils/transactions';
import { AdjustStakeAction } from '../StakePage.types';

export const useHandleAdjustStake = (
  amount: string,
  timestamp: number,
  onComplete: () => void,
  updatedTimestamp: number,
  delegateAddress: string,
  action: AdjustStakeAction,
) => {
  const { signer, account } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const chainId = useCurrentChain();
  const stakingContract = useGetProtocolContract('staking', chainId);

  const handleSubmit = useCallback(async () => {
    if (!signer || !stakingContract) {
      return;
    }

    const handleIncrease = async () => {
      if (!signer || !stakingContract) {
        return;
      }

      const weiAmount = toWei(amount).toString();

      const transactions: Transaction[] = [];

      const approveTx = await prepareApproveTransaction({
        token: COMMON_SYMBOLS.SOV,
        spender: stakingContract.address,
        amount: weiAmount,
        signer,
        chain: chainId,
      });

      if (approveTx) {
        transactions.push(approveTx);
      }

      transactions.push({
        title: t(translations.stakePage.txDialog.increaseStake),
        request: {
          type: TransactionType.signTransaction,
          contract: stakingContract,
          fnName: 'stake',
          args: [weiAmount, timestamp, account, constants.AddressZero],
          gasLimit: GAS_LIMIT.STAKING_INCREASE_STAKE,
        },
        onComplete,
      });

      setTransactions(transactions);

      setTitle(t(translations.stakePage.txDialog.increaseStakeTitle));
      setIsOpen(true);
    };

    const handleDecrease = async () => {
      setTransactions([
        {
          title: t(translations.stakePage.txDialog.decreaseStake),
          request: {
            type: TransactionType.signTransaction,
            contract: stakingContract,
            fnName: 'withdraw',
            args: [toWei(amount), timestamp, account],
            gasLimit: GAS_LIMIT.STAKING_WITHDRAW,
          },
          onComplete,
        },
      ]);
      setTitle(t(translations.stakePage.txDialog.decreaseStakeTitle));
    };

    const handleExtend = async () => {
      if (!updatedTimestamp) {
        return;
      }

      setTransactions([
        {
          title: t(translations.stakePage.txDialog.extendStake),
          request: {
            type: TransactionType.signTransaction,
            contract: stakingContract,
            fnName: 'extendStakingDuration',
            args: [timestamp, updatedTimestamp + 3600],
            gasLimit: GAS_LIMIT.STAKING_EXTEND,
          },
          onComplete,
        },
      ]);
      setTitle(t(translations.stakePage.txDialog.extendStakeTitle));
    };

    const handleDelegate = async () => {
      if (!delegateAddress) {
        return;
      }

      setTransactions([
        {
          title: t(translations.stakePage.txDialog.delegateStake),
          request: {
            type: TransactionType.signTransaction,
            contract: stakingContract,
            fnName: 'delegate',
            args: [delegateAddress.toLowerCase(), timestamp],
            gasLimit: GAS_LIMIT.STAKING_STAKE,
          },
          onComplete,
        },
      ]);
      setTitle(t(translations.stakePage.txDialog.delegateStakeTitle));
    };

    const actions = {
      [AdjustStakeAction.Increase]: handleIncrease,
      [AdjustStakeAction.Decrease]: handleDecrease,
      [AdjustStakeAction.Extend]: handleExtend,
      [AdjustStakeAction.Delegate]: handleDelegate,
    };

    const actionFunction = actions[action];

    if (actionFunction) {
      await actionFunction();
      setIsOpen(true);
    }
  }, [
    signer,
    stakingContract,
    action,
    amount,
    chainId,
    timestamp,
    account,
    onComplete,
    setTransactions,
    setTitle,
    setIsOpen,
    updatedTimestamp,
    delegateAddress,
  ]);

  return handleSubmit;
};
