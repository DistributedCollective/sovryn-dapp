import { useCallback } from 'react';

import { ethers } from 'ethers';
import { t } from 'i18next';

import { getContract } from '@sovryn/contracts';

import { TxType } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { getRskChainId } from '../../../../utils/chain';

export const useClaimCollateralSurplus = (onComplete: () => void) => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  return useCallback(async () => {
    try {
      const { address, abi: massetManagerAbi } = await getContract(
        'borrowerOperations',
        'zero',
        getRskChainId(),
      );
      const borrowerOperations = new ethers.Contract(
        address,
        massetManagerAbi,
        signer,
      );

      setTransactions([
        {
          title: t(translations.zeroPage.tx.claimSurplus),
          request: {
            type: TxType.signTransaction,
            contract: borrowerOperations,
            fnName: 'claimCollateral',
            args: [],
          },
          onComplete,
        },
      ]);
      setTitle(t(translations.zeroPage.tx.claimSurplusTitle));
      setIsOpen(true);
    } catch (error) {
      console.log('error:', error);
    }
  }, [onComplete, setIsOpen, setTitle, setTransactions, signer]);
};
