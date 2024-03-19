import { PERMIT2_ADDRESS, PermitTransferFrom } from '@uniswap/permit2-sdk';

import { useCallback } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import { Decimalish, TroveAdjustmentParams } from '@sovryn-zero/lib-base';
import { getContract } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { isTransactionRequest } from '../../../3_organisms/TransactionStepDialog/helpers';
import { CreditLineSubmitValue } from '../../../3_organisms/ZeroLocForm/types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { getTokenDisplayName } from '../../../../constants/tokens';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { COMMON_SYMBOLS, compareAssets } from '../../../../utils/asset';
import { loadLiquity } from '../../../../utils/liquity';
import { toWei } from '../../../../utils/math';
import {
  getPermitTransferFrom,
  permitHandler,
  prepareApproveTransaction,
  preparePermit2Transaction,
  preparePermitTransaction,
  UNSIGNED_PERMIT,
} from '../../../../utils/transactions';
import { adjustTrove, openTrove } from '../utils/trove-manager';

const baseTranslationPath = translations.zeroPage.tx;

export const toDeadline = (expiration: number): number => {
  return Math.floor((Date.now() + expiration) / 1000);
};

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
        asset: getTokenDisplayName(value.token),
      }),
    };
  }

  if (value.borrow && !isAdjustingCollateral) {
    return {
      dialogTitle: t(baseTranslationPath.borrowTitle),
      transactionTitle: t(baseTranslationPath.borrow, {
        asset: getTokenDisplayName(value.token),
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
  const { signer, account, provider } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const handleTroveSubmit = useCallback(
    async (value: CreditLineSubmitValue) => {
      if (signer) {
        const { address, abi } = await getContract(
          'borrowerOperations',
          'zero',
          RSK_CHAIN_ID,
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

          const isDllr = compareAssets(value.token, COMMON_SYMBOLS.DLLR);
          const transactions: Transaction[] = [];
          let permitTransferFrom: PermitTransferFrom;

          if (isDllr && params.repayZUSD) {
            const value = toWei(params.repayZUSD.toString()).toString();

            const approveTx = await prepareApproveTransaction({
              token: COMMON_SYMBOLS.DLLR,
              spender: PERMIT2_ADDRESS,
              amount: value,
              signer,
              approveMaximumAmount: true,
            });

            if (approveTx) {
              transactions.push(approveTx);
            }

            permitTransferFrom = await getPermitTransferFrom(address, value);
            transactions.push(
              await preparePermit2Transaction(permitTransferFrom, signer),
            );
          }

          const adjustedTrove = await adjustTrove(
            value.token,
            account,
            params,
            value.maxOriginationFeeRate,
          );

          transactions.push({
            title: transactionTitle,
            request: {
              type: TransactionType.signTransaction,
              contract,
              fnName: adjustedTrove.fn,
              args:
                isDllr && params.repayZUSD
                  ? [...adjustedTrove.args, '', '']
                  : adjustedTrove.args,
              value: adjustedTrove.value,
              gasLimit: GAS_LIMIT.ADJUST_TROVE,
            },
            onComplete: callbacks?.onTroveAdjusted,
            updateHandler: permitHandler((req, res) => {
              if (isTransactionRequest(req) && isDllr && params.repayZUSD) {
                req.args = [...adjustedTrove.args, permitTransferFrom, res];
              }
              return req;
            }),
          });

          setTransactions(transactions);
          setIsOpen(true);
          setTitle(dialogTitle);
        } else {
          const openedTrove = await openTrove(
            value.token,
            {
              borrowZUSD: value.borrow || '0',
              depositCollateral: value.depositCollateral || '0',
            },
            value.maxOriginationFeeRate,
          );
          setTransactions([
            {
              title: t(baseTranslationPath.open),
              request: {
                type: TransactionType.signTransaction,
                contract,
                fnName: openedTrove.fn,
                args: openedTrove.args,
                value: openedTrove.value,
                gasLimit: GAS_LIMIT.OPEN_TROVE,
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

  // Do not delete and do not use, this is preserved only for backwards compatibility
  // in case we deploy FE and contracts on other chains than RSK
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTroveSubmitLegacy = useCallback(
    async (value: CreditLineSubmitValue) => {
      if (signer) {
        const { address, abi } = await getContract(
          'borrowerOperations',
          'zero',
          RSK_CHAIN_ID,
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

          const isDllr = value.token.toUpperCase() === COMMON_SYMBOLS.DLLR;
          const transactions: Transaction[] = [];

          if (isDllr && params.repayZUSD) {
            transactions.push(
              await preparePermitTransaction({
                signer,
                token: COMMON_SYMBOLS.DLLR,
                spender: address,
                value: toWei(params.repayZUSD.toString()).toString(),
              }),
            );
          }

          const adjustedTrove = await adjustTrove(
            value.token,
            account,
            params,
            value.maxOriginationFeeRate,
          );

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
              gasLimit: GAS_LIMIT.ADJUST_TROVE,
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
          const openedTrove = await openTrove(
            value.token,
            {
              borrowZUSD: value.borrow || '0',
              depositCollateral: value.depositCollateral || '0',
            },
            value.maxOriginationFeeRate,
          );
          setTransactions([
            {
              title: t(baseTranslationPath.open),
              request: {
                type: TransactionType.signTransaction,
                contract,
                fnName: openedTrove.fn,
                args: openedTrove.args,
                value: openedTrove.value,
                gasLimit: GAS_LIMIT.OPEN_TROVE,
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
    async (token: string) => {
      if (signer && provider) {
        const { address, abi } = await getContract(
          'borrowerOperations',
          'zero',
          RSK_CHAIN_ID,
        );
        const contract = new Contract(address, abi, signer);
        const isDllr = compareAssets(token, COMMON_SYMBOLS.DLLR);

        if (isDllr) {
          const { liquity } = await loadLiquity();
          const value = await liquity
            .getTrove(account)
            .then(trove => toWei(trove.netDebt.toString()).toString());

          const permitTransferFrom = await getPermitTransferFrom(
            address,
            value,
          );

          const transactions: Transaction[] = [];

          const approveTx = await prepareApproveTransaction({
            token: COMMON_SYMBOLS.DLLR,
            spender: PERMIT2_ADDRESS,
            amount: value,
            signer,
            approveMaximumAmount: true,
          });

          if (approveTx) {
            transactions.push(approveTx);
          }

          transactions.push(
            await preparePermit2Transaction(permitTransferFrom, signer),
          );

          transactions.push({
            title: t(baseTranslationPath.close),
            request: {
              type: TransactionType.signTransaction,
              contract,
              fnName: 'closeNueTroveWithPermit2',
              args: [permitTransferFrom, ''],
              gasLimit: GAS_LIMIT.CLOSE_DLLR_TROVE,
            },
            onComplete: callbacks?.onTroveClosed,
            updateHandler: permitHandler((req, res) => {
              if (isTransactionRequest(req)) {
                req.args = [permitTransferFrom, res];
              }
              return req;
            }),
          });

          setTransactions(transactions);
        } else if (compareAssets(token, COMMON_SYMBOLS.ZUSD)) {
          setTransactions([
            {
              title: t(baseTranslationPath.close),
              request: {
                type: TransactionType.signTransaction,
                contract,
                fnName: 'closeTrove',
                args: [],
                gasLimit: GAS_LIMIT.CLOSE_TROVE,
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
      provider,
      setIsOpen,
      setTitle,
      setTransactions,
      signer,
    ],
  );

  // Do not delete and do not use, this is preserved only for backwards compatibility
  // in case we deploy FE and contracts on other chains than RSK
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTroveCloseLegacy = useCallback(
    async (token: string) => {
      if (signer) {
        const { address, abi } = await getContract(
          'borrowerOperations',
          'zero',
          RSK_CHAIN_ID,
        );
        const contract = new Contract(address, abi, signer);
        const isDllr = token.toUpperCase() === COMMON_SYMBOLS.DLLR;

        if (isDllr) {
          const { liquity } = await loadLiquity();
          const value = await liquity
            .getTrove(account)
            .then(trove => toWei(trove.netDebt.toString()).toString());

          setTransactions([
            await preparePermitTransaction({
              signer,
              token: COMMON_SYMBOLS.DLLR,
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
                gasLimit: GAS_LIMIT.CLOSE_DLLR_TROVE,
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
        } else if (token.toUpperCase() === COMMON_SYMBOLS.ZUSD) {
          setTransactions([
            {
              title: t(baseTranslationPath.close),
              request: {
                type: TransactionType.signTransaction,
                contract,
                fnName: 'closeTrove',
                args: [],
                gasLimit: GAS_LIMIT.CLOSE_TROVE,
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
