import { useCallback } from 'react';

import { constants, ethers } from 'ethers';
import { t } from 'i18next';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenDetails,
} from '@sovryn/contracts';

import { defaultChainId } from '../../../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { translations } from '../../../../locales/i18n';
import { toWei } from '../../../../utils/math';
import { prepareApproveTransaction } from '../../../../utils/transactions';

export const useHandleStake = (
  amount: string,
  timestamp: number,
  onComplete: () => void,
) => {
  const { signer, account } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const getMassetManager = useCallback(async () => {
    const { address: massetManagerAddress, abi: massetManagerAbi } =
      await getProtocolContract('massetManager', defaultChainId);

    return new ethers.Contract(massetManagerAddress, massetManagerAbi, signer);
  }, [signer]);

  const stakingContract = useGetProtocolContract('staking');

  const stake = useCallback(async () => {
    if (!signer || !stakingContract) {
      return;
    }
    const massetManager = await getMassetManager();

    const { address: bassetAddress, abi: bassetAbi } = await getTokenDetails(
      SupportedTokens.sov,
      defaultChainId,
    );

    const bassetToken = new ethers.Contract(bassetAddress, bassetAbi, signer);
    const weiAmount = toWei(amount).toString();
    const transactions: Transaction[] = [];

    const approveTx = await prepareApproveTransaction({
      token: SupportedTokens.sov,
      contract: bassetToken,
      spender: massetManager.address,
      amount: weiAmount,
    });

    if (approveTx) {
      transactions.push(approveTx);
    }

    transactions.push({
      title: t(translations.stakePage.txDialog.addNewStake),
      request: {
        type: TransactionType.signTransaction,
        contract: stakingContract,
        fnName: 'stake',
        args: [weiAmount, timestamp, account, constants.AddressZero],
        gasLimit: GAS_LIMIT.STAKING_STAKE,
      },
      onComplete,
    });

    setTransactions(transactions);

    setTitle(t(translations.stakePage.txDialog.addNewStakeTitle));
    setIsOpen(true);
  }, [
    signer,
    stakingContract,
    amount,
    timestamp,
    onComplete,
    setTransactions,
    setTitle,
    setIsOpen,
    account,
    getMassetManager,
  ]);

  const handleSubmit = useCallback(() => stake(), [stake]);

  return handleSubmit;
};
