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

/** Ready exits from one queue. An id is only accepted by the queue holding it. */
export type ExitBatch = {
  queueAddress: string;
  requestIds: string[];
};

/**
 * Release one delayed exit from the perimeter vault to its receiver.
 *
 * The destination is not a parameter: the queue pays the receiver frozen into
 * the request at the moment the withdrawal was made, so this cannot redirect
 * funds. Only the originator or the position owner may call it, and only after
 * the delay has elapsed — the page decides whether to offer the action, so a
 * button never leads to a reverting transaction.
 *
 * The queue and the callback both belong to the call: an exit is held by the
 * queue its own surface pointed at, and only the caller knows which id this
 * release settles.
 */
export const useExecuteExit = () => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  return useCallback(
    async (
      queueAddress: string | undefined,
      requestId: string,
      onComplete?: () => void,
    ) => {
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
    [setIsOpen, setTitle, setTransactions, signer],
  );
};

/**
 * Release several ready exits, one transaction per queue.
 *
 * `executeExits` is atomic on-chain: one locked, blocked or paused id reverts
 * the whole batch. The page therefore passes only ids whose state it has
 * already resolved to releasable — the same rule that decides whether the
 * per-row button renders — so each batch is built from rows that will
 * certainly succeed, never from "everything".
 *
 * Batches are per queue and go into ONE transaction list rather than one call
 * each: a second call would replace the first, and the holder would sign only
 * the last queue's release while believing they had released everything.
 */
export const useExecuteExits = () => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  return useCallback(
    async (batches: ExitBatch[], onComplete?: (batch: ExitBatch) => void) => {
      const usable = batches.filter(
        batch => batch.queueAddress && batch.requestIds.length > 0,
      );
      if (!signer || usable.length === 0) {
        return;
      }

      setTransactions(
        usable.map(({ queueAddress, requestIds }) => ({
          title: t(translations.perimeterPage.tx.executeExits, {
            count: requestIds.length,
          }),
          request: {
            type: TransactionType.signTransaction,
            contract: new ethers.Contract(queueAddress, QUEUE_ABI, signer),
            fnName: 'executeExits',
            args: [requestIds],
          },
          // The batch, not its ids alone: ids restart in each queue.
          onComplete: onComplete
            ? () => onComplete({ queueAddress, requestIds })
            : undefined,
        })),
      );
      setTitle(t(translations.perimeterPage.tx.executeExitTitle));
      setIsOpen(true);
    },
    [setIsOpen, setTitle, setTransactions, signer],
  );
};
