import { useCallback } from 'react';

import { ethers } from 'ethers';
import { t } from 'i18next';

import { TransactionType } from '../../app/3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../contexts/TransactionContext';
import { translations } from '../../locales/i18n';
import { useAccount } from '../useAccount';

const QUEUE_ABI = [
  'function executeExit(uint256 requestId)',
  'function executeExits(uint256[] ids)',
];

/**
 * Release one delayed exit from the perimeter vault to its receiver.
 *
 * The destination is not a parameter: the queue pays the receiver frozen into
 * the request at the moment the withdrawal was made, so this cannot redirect
 * funds. Only the originator or the position owner may call it, and only after
 * the delay has elapsed — the page decides whether to offer the action, so a
 * button never leads to a reverting transaction.
 */
export const useExecuteExit = (
  queueAddress: string | undefined,
  onComplete?: () => void,
) => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  return useCallback(
    async (requestId: string) => {
      if (!queueAddress || !signer) {
        return;
      }
      const queue = new ethers.Contract(queueAddress, QUEUE_ABI, signer);

      setTransactions([
        {
          title: t(translations.perimeterPage.tx.executeExit),
          request: {
            type: TransactionType.signTransaction,
            contract: queue,
            fnName: 'executeExit',
            args: [requestId],
          },
          onComplete,
        },
      ]);
      setTitle(t(translations.perimeterPage.tx.executeExitTitle));
      setIsOpen(true);
    },
    [onComplete, queueAddress, setIsOpen, setTitle, setTransactions, signer],
  );
};

/**
 * Release several ready exits in one transaction.
 *
 * `executeExits` is atomic on-chain: one locked, blocked or paused id reverts
 * the whole batch. The page therefore passes only ids whose state it has
 * already resolved to releasable — the same rule that decides whether the
 * per-row button renders — so the batch is built from rows that will certainly
 * succeed, never from "everything".
 */
export const useExecuteExits = (
  queueAddress: string | undefined,
  onComplete?: () => void,
) => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  return useCallback(
    async (requestIds: string[]) => {
      if (!queueAddress || !signer || requestIds.length === 0) {
        return;
      }
      const queue = new ethers.Contract(queueAddress, QUEUE_ABI, signer);

      setTransactions([
        {
          title: t(translations.perimeterPage.tx.executeExits, {
            count: requestIds.length,
          }),
          request: {
            type: TransactionType.signTransaction,
            contract: queue,
            fnName: 'executeExits',
            args: [requestIds],
          },
          onComplete,
        },
      ]);
      setTitle(t(translations.perimeterPage.tx.executeExitTitle));
      setIsOpen(true);
    },
    [onComplete, queueAddress, setIsOpen, setTitle, setTransactions, signer],
  );
};
