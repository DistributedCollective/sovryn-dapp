import { useCallback } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import { getProtocolContract } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { TransactionType } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';

export const useHandleAdjustVestingStake = (
  contractAddress: string,
  delegateAddress: string,
  onComplete: () => void,
) => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const handleSubmit = useCallback(async () => {
    if (!signer) {
      return;
    }

    const handleDelegate = async () => {
      if (!delegateAddress) {
        return;
      }

      try {
        const { abi: VestingAbi } = await getProtocolContract(
          'vesting',
          RSK_CHAIN_ID,
        );
        const vestingContract = new Contract(
          contractAddress,
          VestingAbi,
          signer,
        );

        setTransactions([
          {
            title: t(translations.stakePage.txDialog.delegateStake),
            request: {
              type: TransactionType.signTransaction,
              contract: vestingContract,
              fnName: 'delegate',
              args: [delegateAddress.toLowerCase()],
              gasLimit: GAS_LIMIT.VESTING_DELEGATE,
            },
            onComplete,
          },
        ]);

        setTitle(t(translations.stakePage.txDialog.delegateStakeTitle));
      } catch (error) {
        console.error('Error handling vesting delegation:', error);
      }
    };

    await handleDelegate();
    setIsOpen(true);
  }, [
    signer,
    onComplete,
    setTransactions,
    setTitle,
    setIsOpen,
    delegateAddress,
    contractAddress,
  ]);

  return handleSubmit;
};
