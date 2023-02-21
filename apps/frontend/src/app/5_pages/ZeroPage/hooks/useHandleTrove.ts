import { Decimalish, TroveAdjustmentParams } from '@sovryn-zero/lib-base';

import { useCallback } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import { getContract } from '@sovryn/contracts';
import { SupportedTokens } from '@sovryn/contracts';

import { TransactionType } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { CreditLineSubmitValue } from '../../../3_organisms/ZeroLocForm/types';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { getRskChainId } from '../../../../utils/chain';
import {
  GAS_LIMIT_ADJUST_TROVE,
  GAS_LIMIT_CLOSE_TROVE,
  GAS_LIMIT_OPEN_TROVE,
} from '../../../../utils/constants';
import { adjustNueTrove, adjustTrove, openTrove } from '../utils/trove-manager';

export const useHandleTrove = (hasLoc: boolean, onComplete: () => void) => {
  const { signer, account } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const handleTroveSubmit = useCallback(
    async (value: CreditLineSubmitValue) => {
      if (signer) {
        const { address, abi } = await getContract(
          'borrowerOperations',
          'zero',
          getRskChainId(),
        );

        const contract = new Contract(address, abi, signer);

        if (hasLoc) {
          const params: Partial<TroveAdjustmentParams<Decimalish>> = {};

          if (value.borrow) {
            params.borrowZUSD = value.borrow;
          }

          if (value.repay) {
            params.repayZUSD = value.repay;
          }

          if (value.depositCollateral) {
            params.depositCollateral = value.depositCollateral;
          }

          if (value.withdrawCollateral) {
            params.withdrawCollateral = value.withdrawCollateral;
          }

          if (value.token === SupportedTokens.dllr) {
            const adjustedTrove = await adjustNueTrove(account, params, signer);
            setTransactions(
              adjustedTrove.map(tx => ({
                title: tx.title,
                request: {
                  type: TransactionType.signTransaction,
                  contract: tx.contract ?? contract,
                  fnName: tx.fn,
                  args: tx.args,
                  value: tx.value,
                  gasLimit: tx.gas,
                },
                onComplete,
              })),
            );
          } else {
            const adjustedTrove = await adjustTrove(account, params);
            setTransactions([
              {
                title: t(translations.zeroPage.tx.adjustTrove),
                request: {
                  type: TransactionType.signTransaction,
                  contract,
                  fnName: adjustedTrove.fn,
                  args: adjustedTrove.args,
                  value: adjustedTrove.value,
                  gasLimit: GAS_LIMIT_ADJUST_TROVE,
                },
                onComplete,
              },
            ]);
          }
          setIsOpen(true);
          setTitle(t(translations.zeroPage.tx.adjustTitle));
        } else {
          const openedTrove = await openTrove(value.token, {
            borrowZUSD: value.borrow || '0',
            depositCollateral: value.depositCollateral || '0',
          });
          setTransactions([
            {
              title: t(translations.zeroPage.tx.openTrove),
              request: {
                type: TransactionType.signTransaction,
                contract,
                fnName: openedTrove.fn,
                args: openedTrove.args,
                value: openedTrove.value,
                gasLimit: GAS_LIMIT_OPEN_TROVE,
              },
              onComplete,
            },
          ]);
          setIsOpen(true);
          setTitle(t(translations.zeroPage.tx.openTitle));
        }
      }
    },
    [account, hasLoc, onComplete, setIsOpen, setTitle, setTransactions, signer],
  );

  const handleTroveClose = useCallback(async () => {
    if (signer) {
      const { address, abi } = await getContract(
        'borrowerOperations',
        'zero',
        getRskChainId(),
      );

      const contract = new Contract(address, abi, signer);

      setTransactions([
        {
          title: t(translations.zeroPage.tx.closeTrove),
          request: {
            type: TransactionType.signTransaction,
            contract,
            fnName: 'closeTrove',
            args: [],
            gasLimit: GAS_LIMIT_CLOSE_TROVE,
          },
          onComplete,
        },
      ]);
      setIsOpen(true);
      setTitle(t(translations.zeroPage.tx.closeTitle));
    }
  }, [onComplete, setIsOpen, setTitle, setTransactions, signer]);

  return { handleTroveSubmit, handleTroveClose };
};
