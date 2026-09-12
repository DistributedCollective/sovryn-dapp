import React, { useCallback } from 'react';

import { Contract, utils } from 'ethers';
import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { getProvider } from '@sovryn/ethers-provider';
import { NotificationType } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../config/chains';

import { useNotificationContext } from '../../contexts/NotificationContext';
import { translations } from '../../locales/i18n';
import {
  BlockState,
  ExitStatus,
  PendingExit,
  exitKey,
} from '../../utils/exitDelay';
import { useAccount } from '../useAccount';
import { callRaw } from './rawCall';
import { ExitBatch, useExecuteExit, useExecuteExits } from './useExecuteExit';

export type ReleaseRow = Pick<
  PendingExit,
  'id' | 'queueAddress' | 'originator' | 'owner' | 'receiver'
>;

const QUEUE_READS = [
  'function blockStateOf(address a) view returns (uint8)',
  'function getRequest(uint256 id) view returns (tuple(uint128 amount, uint64 createdAt, uint64 unlockAt, address originator, address owner, address receiver, address token, bytes32 surfaceId, address subProduct, uint8 status, bool unwrapOnDelivery))',
];

const QUEUE_RELEASES = new utils.Interface([
  'function executeExit(uint256 requestId)',
  'function executeExits(uint256[] ids)',
]);

/** The queue's own errors for a delivery it refuses. */
const QUEUE_ERRORS = new utils.Interface([
  'error QueuePaused()',
  'error UnknownRequest(uint256 id)',
  'error AlreadyTerminal(uint256 id)',
  'error NotUnlocked(uint256 id, uint64 unlockAt)',
  'error NotExecutor(address caller)',
  'error ActorBlocked(address actor, uint8 state)',
]);

/** Long enough to read a list of withdrawals that were not released. */
const REFUSAL_TIMEOUT_MS = 30_000;

type Party = 'account' | 'originator' | 'owner' | 'receiver';

type BlockName = 'frozen' | 'blacklisted';

type BlockCheck =
  | { kind: 'clear' }
  | { kind: 'blocked'; party: Party; state: BlockName }
  | { kind: 'unreadable' };

const BLOCK_NAMES: Partial<Record<number, BlockName>> = {
  [BlockState.Frozen]: 'frozen',
  [BlockState.Blacklisted]: 'blacklisted',
};

const queueReader = (queueAddress: string) =>
  new Contract(queueAddress, QUEUE_READS, getProvider(RSK_CHAIN_ID));

const shortAddress = (address: string): string =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

/** A row's status, read fresh from its queue; undefined when the read failed. */
const readStatus = async (row: ReleaseRow): Promise<number | undefined> => {
  try {
    const request = await queueReader(row.queueAddress).getRequest(row.id);
    return Number(request.status);
  } catch (error) {
    return undefined;
  }
};

/**
 * Read, fresh from the queue, whether a party the delivery rule checks is
 * blocked.
 *
 * The parties are checked in the contract's order — the address that started
 * the withdrawal, the position owner, the receiver — and the first blocked one
 * is named; a party that is the connected account is named as the holder's own
 * address whatever its role. A read that fails, or a state outside the known
 * values, is unreadable: nothing may be sent on it.
 */
const checkBlocks = async (
  row: ReleaseRow,
  account: string,
): Promise<BlockCheck> => {
  const parties: [Party, string][] = [
    ['originator', row.originator],
    ['owner', row.owner],
    ['receiver', row.receiver],
  ];

  let states: number[];
  try {
    const queue = queueReader(row.queueAddress);
    const reads = new Map<string, Promise<number>>();
    const readState = (address: string): Promise<number> => {
      const key = address.toLowerCase();
      const cached = reads.get(key);
      if (cached) {
        return cached;
      }
      const read: Promise<number> = queue.blockStateOf(address).then(Number);
      reads.set(key, read);
      return read;
    };
    states = await Promise.all(
      parties.map(([, address]) => readState(address)),
    );
  } catch (error) {
    return { kind: 'unreadable' };
  }

  for (let index = 0; index < parties.length; index++) {
    if (states[index] === BlockState.None) {
      continue;
    }
    const state = BLOCK_NAMES[states[index]];
    if (!state) {
      return { kind: 'unreadable' };
    }
    const [role, address] = parties[index];
    return {
      kind: 'blocked',
      party: address.toLowerCase() === account.toLowerCase() ? 'account' : role,
      state,
    };
  }
  return { kind: 'clear' };
};

const blockRefusal = (row: ReleaseRow, check: BlockCheck): string =>
  check.kind === 'blocked'
    ? t(translations.perimeterPage.releaseRefused.blocked, {
        id: row.id,
        party: t(translations.perimeterPage.releaseRefused.party[check.party]),
        state: t(translations.perimeterPage.releaseRefused.state[check.state]),
      })
    : t(translations.perimeterPage.releaseRefused.unreadable, { id: row.id });

/** Why the queue would refuse a delivery, in plain words, from its revert data. */
const refusalReason = (data: string | undefined, account: string): string => {
  const reasons = translations.perimeterPage.releaseRefused.reason;
  let error: ReturnType<typeof QUEUE_ERRORS.parseError> | undefined;
  try {
    error = data && data !== '0x' ? QUEUE_ERRORS.parseError(data) : undefined;
  } catch (parseError) {
    error = undefined;
  }
  if (!error) {
    return t(reasons.refused);
  }
  switch (error.name) {
    case 'QueuePaused':
      return t(reasons.paused);
    case 'NotUnlocked':
      return t(reasons.notUnlocked, { id: error.args.id.toString() });
    case 'AlreadyTerminal':
      return t(reasons.alreadyTerminal, { id: error.args.id.toString() });
    case 'UnknownRequest':
      return t(reasons.unknownRequest, { id: error.args.id.toString() });
    case 'NotExecutor':
      return t(reasons.notExecutor);
    case 'ActorBlocked': {
      const state = BLOCK_NAMES[Number(error.args.state)];
      if (!state) {
        return t(reasons.refused);
      }
      const actor: string = error.args.actor;
      return t(reasons.actorBlocked, {
        address:
          actor.toLowerCase() === account.toLowerCase()
            ? t(translations.perimeterPage.releaseRefused.party.account)
            : shortAddress(actor),
        state: t(translations.perimeterPage.releaseRefused.state[state]),
      });
    }
    default:
      return t(reasons.refused);
  }
};

type DryRun = { kind: 'accepted' } | { kind: 'refused'; reason: string };

/**
 * Ask the queue, with `eth_call` from the holder's own address, whether it
 * would accept this release now. A dry run that could not be completed is a
 * refusal too: an unanswered check is not a yes.
 */
const dryRun = async (
  batch: ExitBatch,
  single: boolean,
  account: string,
): Promise<DryRun> => {
  const data = single
    ? QUEUE_RELEASES.encodeFunctionData('executeExit', [batch.requestIds[0]])
    : QUEUE_RELEASES.encodeFunctionData('executeExits', [batch.requestIds]);
  try {
    const outcome = await callRaw(getProvider(RSK_CHAIN_ID), {
      from: account,
      to: batch.queueAddress,
      data,
    });
    if (outcome.kind === 'result') {
      return { kind: 'accepted' };
    }
    if (outcome.kind === 'reverted') {
      return { kind: 'refused', reason: refusalReason(outcome.data, account) };
    }
  } catch (error) {
    // Treated below as a dry run that could not be completed.
  }
  return {
    kind: 'refused',
    reason: t(translations.perimeterPage.releaseRefused.reason.unchecked),
  };
};

const batchRefusal = (batch: ExitBatch, reason: string): string =>
  t(translations.perimeterPage.releaseRefused.batch, {
    count: batch.requestIds.length,
    ids: batch.requestIds.map(id => `#${id}`).join(', '),
    reason,
  });

/** Rows grouped by the queue that holds them: a queue accepts only its own ids. */
const byQueue = (rows: ReleaseRow[]): ExitBatch[] => {
  const batches = new Map<string, ExitBatch>();
  rows.forEach(row => {
    const batch = batches.get(row.queueAddress) ?? {
      queueAddress: row.queueAddress,
      requestIds: [],
    };
    batch.requestIds.push(row.id);
    batches.set(row.queueAddress, batch);
  });
  return [...batches.values()];
};

/**
 * Release withdrawals from the Perimeter vault, one row or several, sending
 * only what the queue will still accept.
 *
 * The page's rows are only as fresh as its last read, and `executeExits` is
 * atomic: one id that changed since then reverts every release in its batch.
 * So, when the holder presses Release:
 *
 * 1. each row's status is read fresh. A row no longer queued was delivered by
 *    someone else and leaves the page through `onReleased`, with no error;
 * 2. the rows still queued get the block check. A withdrawal whose party is
 *    frozen or blacklisted looks like any other row, and this is where the
 *    block is revealed: that row is not sent;
 * 3. the queue is asked in a dry run, from the holder's address, whether it
 *    would accept each queue's release. A refusal, or a dry run that could not
 *    be completed, sends nothing for that queue.
 *
 * One notice tells the holder, in plain words, which withdrawals were not
 * released and why. What remains is sent: one row as `executeExit`, several
 * grouped by queue into one transaction list. `onReleased` receives the keys
 * (queue and id) of the rows a completed transaction settled.
 */
export const usePerimeterRelease = () => {
  const { account } = useAccount();
  const executeExit = useExecuteExit();
  const executeExits = useExecuteExits();
  const { addNotification } = useNotificationContext();

  return useCallback(
    async (rows: ReleaseRow[], onReleased: (keys: string[]) => void) => {
      if (!account || rows.length === 0) {
        return;
      }

      const refusals: string[] = [];

      const statuses = await Promise.all(rows.map(readStatus));
      const delivered: string[] = [];
      const queued = rows.filter((row, index) => {
        const status = statuses[index];
        if (status === undefined) {
          refusals.push(
            t(translations.perimeterPage.releaseRefused.statusUnreadable, {
              id: row.id,
            }),
          );
          return false;
        }
        if (status !== ExitStatus.Queued) {
          delivered.push(exitKey(row));
          return false;
        }
        return true;
      });
      if (delivered.length > 0) {
        onReleased(delivered);
      }

      const checks = await Promise.all(
        queued.map(row => checkBlocks(row, account)),
      );
      const clear = queued.filter((row, index) => {
        if (checks[index].kind === 'clear') {
          return true;
        }
        refusals.push(blockRefusal(row, checks[index]));
        return false;
      });

      const single = clear.length === 1;
      const batches = byQueue(clear);
      const dryRuns = await Promise.all(
        batches.map(batch => dryRun(batch, single, account)),
      );
      const accepted = batches.filter((batch, index) => {
        const outcome = dryRuns[index];
        if (outcome.kind === 'accepted') {
          return true;
        }
        refusals.push(batchRefusal(batch, outcome.reason));
        return false;
      });

      if (refusals.length > 0) {
        addNotification(
          {
            type: NotificationType.warning,
            id: nanoid(),
            title: t(translations.perimeterPage.releaseRefused.title),
            content: (
              <>
                {refusals.map(line => (
                  <p key={line}>{line}</p>
                ))}
              </>
            ),
            dismissible: true,
          },
          REFUSAL_TIMEOUT_MS,
        );
      }

      if (single && accepted.length === 1) {
        const [row] = clear;
        await executeExit(row.queueAddress, row.id, () =>
          onReleased([exitKey(row)]),
        );
      } else if (accepted.length > 0) {
        await executeExits(accepted, batch =>
          onReleased(
            batch.requestIds.map(id =>
              exitKey({ queueAddress: batch.queueAddress, id }),
            ),
          ),
        );
      }
    },
    [account, addNotification, executeExit, executeExits],
  );
};
