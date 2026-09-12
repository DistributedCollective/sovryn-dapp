import { useCallback } from 'react';

import { ethers, providers } from 'ethers';
import { t } from 'i18next';

import {
  SignTransactionRequest,
  Transaction,
  TransactionConfig,
  TransactionType,
} from '../../app/3_organisms/TransactionStepDialog/TransactionStepDialog.types';
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
 * The release check, run inside the transaction dialog's send step,
 * immediately before the wallet is asked to sign, and told the gas limit the
 * holder typed in the dialog's Advanced settings, if any. It resolves to the
 * ids of the batch that still pass, the gas limit to send exactly those with,
 * and the account the check ran for, or rejects, and then nothing is sent.
 */
export type ExitPreflight = (
  batch: ExitBatch,
  typedGasLimit: string | undefined,
) => Promise<{ requestIds: string[]; gasLimit: string; from: string }>;

export type ExitSendOptions<OnComplete> = {
  preflight: ExitPreflight;
  onComplete?: OnComplete;
};

const notSendable = () =>
  new Error('The release check passed nothing this transaction may send.');

/**
 * The release's contract bound to one account's signer. The wallet is then
 * handed a transaction from the account the check ran for, not from whichever
 * account is active in it when it signs.
 */
const boundTo = (
  request: SignTransactionRequest,
  provider: providers.JsonRpcProvider,
  from: string,
) => request.contract.connect(provider.getSigner(from));

/**
 * A gas limit the holder typed in the dialog's Advanced settings; undefined
 * when the step holds a limit the dialog prepared, or the field is empty.
 */
const typedGasLimitOf = (config: TransactionConfig): string | undefined => {
  const limit = config.gasLimit?.toString() ?? '';
  return config.gasLimitTypedByUser && limit !== '' ? limit : undefined;
};

/**
 * Release one delayed exit from the perimeter vault to its receiver.
 *
 * The destination is not a parameter: the queue pays the receiver frozen into
 * the request at the moment the withdrawal was made, so this cannot redirect
 * funds.
 *
 * The dialog hands the release to the wallet only after `preflight` passes it
 * inside the send step, with the gas limit `preflight` settles on for it and
 * from the account `preflight` checked: state and the wallet's active account
 * can change while the dialog is open, and the dialog's own estimate, made
 * when it opens, falls back to a flat limit when it fails.
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
      { preflight, onComplete }: ExitSendOptions<() => void>,
    ) => {
      if (!queueAddress || !signer) {
        return;
      }
      const { provider } = signer;
      const request: SignTransactionRequest = {
        type: TransactionType.signTransaction,
        contract: new ethers.Contract(queueAddress, QUEUE_ABI, signer),
        fnName: 'executeExit',
        args: [requestId],
      };

      const transaction: Transaction = {
        title: t(translations.perimeterPage.tx.executeExit),
        request,
        beforeSend: async ({ config }) => {
          const checked = await preflight(
            { queueAddress, requestIds: [requestId] },
            typedGasLimitOf(config),
          );
          if (
            !checked.from ||
            checked.requestIds.length !== 1 ||
            checked.requestIds[0] !== requestId
          ) {
            throw notSendable();
          }
          return {
            request: {
              ...request,
              contract: boundTo(request, provider, checked.from),
            },
            config: { ...config, gasLimit: checked.gasLimit },
          };
        },
        onComplete,
      };

      setTransactions([transaction]);
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
 * the whole batch. Each transaction therefore sends only the ids `preflight`
 * still passes inside its send step, with the gas limit it settles on for
 * exactly those, and reports exactly those as settled once it completes.
 *
 * Batches are per queue and go into ONE transaction list rather than one call
 * each: a second call would replace the first, and the holder would sign only
 * the last queue's release while believing they had released everything.
 */
export const useExecuteExits = () => {
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  return useCallback(
    async (
      batches: ExitBatch[],
      { preflight, onComplete }: ExitSendOptions<(batch: ExitBatch) => void>,
    ) => {
      const usable = batches.filter(
        batch => batch.queueAddress && batch.requestIds.length > 0,
      );
      if (!signer || usable.length === 0) {
        return;
      }
      const { provider } = signer;

      setTransactions(
        usable.map(({ queueAddress, requestIds }): Transaction => {
          const request: SignTransactionRequest = {
            type: TransactionType.signTransaction,
            contract: new ethers.Contract(queueAddress, QUEUE_ABI, signer),
            fnName: 'executeExits',
            args: [requestIds],
          };
          // The ids the latest send step handed to the wallet.
          let sentIds = requestIds;

          return {
            title: t(translations.perimeterPage.tx.executeExits, {
              count: requestIds.length,
            }),
            request,
            beforeSend: async ({ config }) => {
              const checked = await preflight(
                { queueAddress, requestIds },
                typedGasLimitOf(config),
              );
              if (
                !checked.from ||
                checked.requestIds.length === 0 ||
                checked.requestIds.some(id => !requestIds.includes(id))
              ) {
                throw notSendable();
              }
              sentIds = checked.requestIds;
              return {
                request: {
                  ...request,
                  contract: boundTo(request, provider, checked.from),
                  args: [checked.requestIds],
                },
                config: { ...config, gasLimit: checked.gasLimit },
              };
            },
            // The batch, not its ids alone: ids restart in each queue.
            onComplete: onComplete
              ? () => onComplete({ queueAddress, requestIds: sentIds })
              : undefined,
          };
        }),
      );
      setTitle(t(translations.perimeterPage.tx.executeExitTitle));
      setIsOpen(true);
    },
    [setIsOpen, setTitle, setTransactions, signer],
  );
};
