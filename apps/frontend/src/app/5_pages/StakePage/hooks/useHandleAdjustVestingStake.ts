import { useCallback } from 'react';

import { t } from 'i18next';

import { TransactionType } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { translations } from '../../../../locales/i18n';
import { getRskChainId } from '../../../../utils/chain';

export const useHandleAdjustVestingStake = (
  delegateAddress: string,
  onComplete: () => void,
) => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const vestingContract = useGetProtocolContract('vesting', getRskChainId());

  const handleSubmit = useCallback(async () => {
    if (!signer || !vestingContract) {
      return;
    }

    const handleDelegate = async () => {
      if (!delegateAddress) {
        return;
      }

      setTransactions([
        {
          title: t(translations.stakePage.txDialog.delegateStake),
          request: {
            type: TransactionType.signTransaction,
            contract: vestingContract,
            fnName: 'delegate',
            args: [delegateAddress],
            gasLimit: GAS_LIMIT.VESTING_DELEGATE,
          },
          onComplete,
        },
      ]);
      setTitle(t(translations.stakePage.txDialog.delegateStakeTitle));
    };

    handleDelegate();
    setIsOpen(true);
  }, [
    signer,
    vestingContract,
    onComplete,
    setTransactions,
    setTitle,
    setIsOpen,
    delegateAddress,
  ]);

  return handleSubmit;
};
