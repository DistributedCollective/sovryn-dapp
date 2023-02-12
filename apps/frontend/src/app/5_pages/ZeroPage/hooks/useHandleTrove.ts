import { Decimalish, TroveAdjustmentParams } from '@sovryn-zero/lib-base';

import { useCallback } from 'react';

import { Contract } from 'ethers';
import { useTranslation } from 'react-i18next';

import { getContract } from '@sovryn/contracts';
import { SupportedTokens } from '@sovryn/contracts';

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
  const { t } = useTranslation();

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
                contract: tx.contract ?? contract,
                fnName: tx.fn,
                config: {
                  value: tx.value,
                  gasLimit: tx.gas,
                },
                args: tx.args,
                onComplete,
              })),
            );
          } else {
            const adjustedTrove = await adjustTrove(account, params);
            setTransactions([
              {
                title: t(translations.zeroPage.tx.adjustTrove),
                contract,
                fnName: adjustedTrove.fn,
                config: {
                  value: adjustedTrove.value,
                  gasLimit: GAS_LIMIT_ADJUST_TROVE,
                },
                args: adjustedTrove.args,
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
              contract,
              fnName: openedTrove.fn,
              config: {
                value: openedTrove.value,
                gasLimit: GAS_LIMIT_OPEN_TROVE,
              },
              args: openedTrove.args,
              onComplete,
            },
          ]);
          setIsOpen(true);
          setTitle(t(translations.zeroPage.tx.openTitle));
        }
      }
    },
    [
      account,
      hasLoc,
      onComplete,
      setIsOpen,
      setTitle,
      setTransactions,
      signer,
      t,
    ],
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
          contract,
          fnName: 'closeTrove',
          args: [],
          onComplete,
          config: {
            gasLimit: GAS_LIMIT_CLOSE_TROVE,
          },
        },
      ]);
      setIsOpen(true);
      setTitle(t(translations.zeroPage.tx.closeTitle));
    }
  }, [onComplete, setIsOpen, setTitle, setTransactions, signer, t]);

  return { handleTroveSubmit, handleTroveClose };
};
