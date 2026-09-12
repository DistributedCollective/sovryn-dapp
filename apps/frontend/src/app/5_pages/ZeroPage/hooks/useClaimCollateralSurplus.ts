import { useCallback } from 'react';

import { ethers } from 'ethers';
import { t } from 'i18next';

import { getContract } from '@sovryn/contracts';

import { TransactionType } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { usePerimeterHoldToast } from '../../../../hooks/exitDelay/usePerimeterHoldToast';
import { useZeroExitDelayQuote } from '../../../../hooks/exitDelay/useZeroExitDelayQuote';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { getRskChainId } from '../../../../utils/chain';
import { SURFACE_ZERO_CLAIM_SURPLUS } from '../../../../utils/exitFee';

export const useClaimCollateralSurplus = (onComplete: () => void) => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  // The claim is held by the withdrawal delay like the other Zero exits, so
  // its completion names the vault the same way.
  const claimDelay = useZeroExitDelayQuote(SURFACE_ZERO_CLAIM_SURPLUS);
  const notifyHold = usePerimeterHoldToast(claimDelay);

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
            type: TransactionType.signTransaction,
            contract: borrowerOperations,
            fnName: 'claimCollateral',
            args: [],
          },
          onComplete: () => {
            onComplete();
            notifyHold();
          },
        },
      ]);
      setTitle(t(translations.zeroPage.tx.claimSurplusTitle));
      setIsOpen(true);
    } catch (error) {
      console.log('error:', error);
    }
  }, [notifyHold, onComplete, setIsOpen, setTitle, setTransactions, signer]);
};
