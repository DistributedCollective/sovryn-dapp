import { useCallback } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import { Decimalish, TroveAdjustmentParams } from '@sovryn-zero/lib-base';
import { getContract } from '@sovryn/contracts';
import { SupportedTokens } from '@sovryn/contracts';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { isTransactionRequest } from '../../../3_organisms/TransactionStepDialog/helpers';
import { CreditLineSubmitValue } from '../../../3_organisms/ZeroLocForm/types';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { getRskChainId } from '../../../../utils/chain';
import {
  GAS_LIMIT_ADJUST_TROVE,
  GAS_LIMIT_CLOSE_DLLR_TROVE,
  GAS_LIMIT_CLOSE_TROVE,
  GAS_LIMIT_OPEN_TROVE,
} from '../../../../utils/constants';
import { loadLiquity } from '../../../../utils/liquity';
import { toWei } from '../../../../utils/math';
import {
  permitHandler,
  preparePermitTransaction,
  UNSIGNED_PERMIT,
} from '../../../../utils/transactions';
import { adjustTrove, openTrove } from '../utils/trove-manager';

const baseTranslationPath = translations.zeroPage.tx;

const getAdjustTroveTexts = (
  value: CreditLineSubmitValue,
): { dialogTitle: string; transactionTitle: string } => {
  const isAdjustingDebt =
    (value.borrow && value.borrow !== '0') ||
    (value.repay && value.repay !== '0');

  const isAdjustingCollateral =
    (value.depositCollateral && value.depositCollateral !== '0') ||
    (value.withdrawCollateral && value.withdrawCollateral !== '0');

  if (value.repay && !isAdjustingCollateral) {
    return {
      dialogTitle: t(baseTranslationPath.repayTitle),
      transactionTitle: t(baseTranslationPath.repay, {
        asset: value.token.toUpperCase(),
      }),
    };
  }

  if (value.borrow && !isAdjustingCollateral) {
    return {
      dialogTitle: t(baseTranslationPath.borrowTitle),
      transactionTitle: t(baseTranslationPath.borrow, {
        asset: value.token.toUpperCase(),
      }),
    };
  }

  if (value.depositCollateral && !isAdjustingDebt) {
    return {
      dialogTitle: t(baseTranslationPath.addCollateralTitle),
      transactionTitle: t(baseTranslationPath.addCollateral),
    };
  }

  if (value.withdrawCollateral && !isAdjustingDebt) {
    return {
      dialogTitle: t(baseTranslationPath.withdrawCollateralTitle),
      transactionTitle: t(baseTranslationPath.withdrawCollateral),
    };
  }

  return {
    dialogTitle: t(baseTranslationPath.adjustTitle),
    transactionTitle: t(baseTranslationPath.adjust),
  };
};

type HandleTroveCallbacks = {
  onTroveOpened: () => void;
  onTroveAdjusted: () => void;
  onTroveClosed: () => void;
};

export const useHandleTrove = (
  hasLoc: boolean,
  callbacks?: Partial<HandleTroveCallbacks>,
) => {
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
          const { dialogTitle, transactionTitle } = getAdjustTroveTexts(value);

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

          const isDllr = value.token === SupportedTokens.dllr;
          const transactions: Transaction[] = [];

          if (isDllr && params.repayZUSD) {
            transactions.push(
              await preparePermitTransaction({
                signer,
                token: SupportedTokens.dllr,
                spender: address,
                value: toWei(params.repayZUSD.toString()).toString(),
              }),
            );
          }

          const adjustedTrove = await adjustTrove(value.token, account, params);

          transactions.push({
            title: transactionTitle,
            request: {
              type: TransactionType.signTransaction,
              contract,
              fnName: adjustedTrove.fn,
              args: isDllr
                ? [...adjustedTrove.args, UNSIGNED_PERMIT]
                : adjustedTrove.args,
              value: adjustedTrove.value,
              gasLimit: GAS_LIMIT_ADJUST_TROVE,
            },
            onComplete: callbacks?.onTroveAdjusted,
            updateHandler: permitHandler((req, res) => {
              if (isTransactionRequest(req) && isDllr) {
                req.args = [...adjustedTrove.args, res];
              }
              return req;
            }),
          });

          setTransactions(transactions);
          setIsOpen(true);
          setTitle(dialogTitle);
        } else {
          const openedTrove = await openTrove(value.token, {
            borrowZUSD: value.borrow || '0',
            depositCollateral: value.depositCollateral || '0',
          });
          setTransactions([
            {
              title: t(baseTranslationPath.open),
              request: {
                type: TransactionType.signTransaction,
                contract,
                fnName: openedTrove.fn,
                args: openedTrove.args,
                value: openedTrove.value,
                gasLimit: GAS_LIMIT_OPEN_TROVE,
              },
              onComplete: callbacks?.onTroveOpened,
            },
          ]);
          setIsOpen(true);
          setTitle(t(baseTranslationPath.openTitle));
        }
      }
    },
    [
      account,
      callbacks?.onTroveAdjusted,
      callbacks?.onTroveOpened,
      hasLoc,
      setIsOpen,
      setTitle,
      setTransactions,
      signer,
    ],
  );

  const handleTroveClose = useCallback(
    async (token: SupportedTokens) => {
      if (signer) {
        const { address, abi } = await getContract(
          'borrowerOperations',
          'zero',
          getRskChainId(),
        );
        const contract = new Contract(address, abi, signer);
        const isDllr = token === SupportedTokens.dllr;

        if (isDllr) {
          const { liquity } = await loadLiquity();
          const value = await liquity
            .getTrove(account)
            .then(trove => toWei(trove.netDebt.toString()).toString());

          setTransactions([
            await preparePermitTransaction({
              signer,
              token: SupportedTokens.dllr,
              spender: address,
              value,
            }),
            {
              title: t(baseTranslationPath.close),
              request: {
                type: TransactionType.signTransaction,
                contract,
                fnName: 'closeNueTrove',
                args: [],
                gasLimit: GAS_LIMIT_CLOSE_DLLR_TROVE,
              },
              onComplete: callbacks?.onTroveClosed,
              updateHandler: permitHandler((req, res) => {
                if (isTransactionRequest(req)) {
                  req.args = [res];
                }
                return req;
              }),
            },
          ]);
        } else if (token === SupportedTokens.zusd) {
          setTransactions([
            {
              title: t(baseTranslationPath.close),
              request: {
                type: TransactionType.signTransaction,
                contract,
                fnName: 'closeTrove',
                args: [],
                gasLimit: GAS_LIMIT_CLOSE_TROVE,
              },
              onComplete: callbacks?.onTroveClosed,
            },
          ]);
        } else {
          throw new Error('Unsupported token');
        }

        setIsOpen(true);
        setTitle(t(baseTranslationPath.closeTitle));
      }
    },
    [
      account,
      callbacks?.onTroveClosed,
      setIsOpen,
      setTitle,
      setTransactions,
      signer,
    ],
  );

  return { handleTroveSubmit, handleTroveClose };
};
