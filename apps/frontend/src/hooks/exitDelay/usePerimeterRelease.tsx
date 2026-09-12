import React, { useCallback } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { getProvider } from '@sovryn/ethers-provider';
import { NotificationType } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../config/chains';

import { useNotificationContext } from '../../contexts/NotificationContext';
import { translations } from '../../locales/i18n';
import { BlockState, PendingExit, exitKey } from '../../utils/exitDelay';
import { useAccount } from '../useAccount';
import { ExitBatch, useExecuteExit, useExecuteExits } from './useExecuteExit';

export type ReleaseRow = Pick<
  PendingExit,
  'id' | 'queueAddress' | 'originator' | 'owner' | 'receiver'
>;

const QUEUE_ABI = ['function blockStateOf(address a) view returns (uint8)'];

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
  const queue = new Contract(
    row.queueAddress,
    QUEUE_ABI,
    getProvider(RSK_CHAIN_ID),
  );
  const parties: [Party, string][] = [
    ['originator', row.originator],
    ['owner', row.owner],
    ['receiver', row.receiver],
  ];

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

  let states: number[];
  try {
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

const refusalFor = (row: ReleaseRow, check: BlockCheck): string =>
  check.kind === 'blocked'
    ? t(translations.perimeterPage.releaseRefused.blocked, {
        id: row.id,
        party: t(translations.perimeterPage.releaseRefused.party[check.party]),
        state: t(translations.perimeterPage.releaseRefused.state[check.state]),
      })
    : t(translations.perimeterPage.releaseRefused.unreadable, { id: row.id });

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
 * Release withdrawals from the Perimeter vault, one row or several.
 *
 * A withdrawal whose party is frozen or blacklisted looks like any other row,
 * so the block is checked here, when the holder presses Release: each row's
 * parties are read fresh from its queue, a row with a blocked party or an
 * unreadable block state is not sent, and one notice tells the holder, in
 * plain words, which withdrawals were not released and why. The rows that read
 * clear are sent — several of them grouped by queue into one transaction list,
 * since `executeExits` is atomic and one refused id reverts the whole batch.
 *
 * `onReleased` receives the keys (queue and id) of the rows a completed
 * transaction settled.
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

      const checks = await Promise.all(
        rows.map(row => checkBlocks(row, account)),
      );
      const sendable = rows.filter(
        (_, index) => checks[index].kind === 'clear',
      );
      const refusals = rows.flatMap((row, index) =>
        checks[index].kind === 'clear' ? [] : [refusalFor(row, checks[index])],
      );

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

      if (sendable.length === 1) {
        const [row] = sendable;
        await executeExit(row.queueAddress, row.id, () =>
          onReleased([exitKey(row)]),
        );
      } else if (sendable.length > 1) {
        await executeExits(byQueue(sendable), batch =>
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
