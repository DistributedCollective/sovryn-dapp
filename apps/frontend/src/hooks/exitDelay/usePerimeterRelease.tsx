import React, { useCallback } from 'react';

import { BigNumber, Contract, providers, utils } from 'ethers';
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
import {
  ExitPreflight,
  useExecuteExit,
  useExecuteExits,
} from './useExecuteExit';

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

type WalletNetwork = 'expected' | 'other' | 'unreadable';

/**
 * Which network the wallet itself says it is on.
 *
 * The wallet is asked directly with `eth_chainId`: the signer's provider keeps
 * the network it first detected, and a switch made in the wallet afterwards
 * does not show there. No signer, a rejected request, or an answer that is not
 * a chain id is unreadable.
 */
const readWalletNetwork = async (
  signer: providers.JsonRpcSigner | undefined,
): Promise<WalletNetwork> => {
  if (!signer || typeof signer.provider?.send !== 'function') {
    return 'unreadable';
  }
  try {
    const chainId = await signer.provider.send('eth_chainId', []);
    return BigNumber.from(chainId).eq(BigNumber.from(RSK_CHAIN_ID))
      ? 'expected'
      : 'other';
  } catch (error) {
    return 'unreadable';
  }
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

/** One line naming withdrawals that are not released, and why. */
const rowsRefusal = (rows: ReleaseRow[], reason: string): string =>
  t(translations.perimeterPage.releaseRefused.batch, {
    count: rows.length,
    ids: rows.map(row => `#${row.id}`).join(', '),
    reason,
  });

type Refusal = {
  reason: string;
  /** The ids the refusal names; undefined when it holds for the whole call. */
  ids?: string[];
};

/**
 * Why the queue would refuse a delivery, in plain words, from its revert data,
 * and which of the withdrawals asked about it names, when it names any.
 */
const refusalOf = (
  data: string | undefined,
  rows: ReleaseRow[],
  account: string,
): Refusal => {
  const reasons = translations.perimeterPage.releaseRefused.reason;
  let error: ReturnType<typeof QUEUE_ERRORS.parseError> | undefined;
  try {
    error = data && data !== '0x' ? QUEUE_ERRORS.parseError(data) : undefined;
  } catch (parseError) {
    error = undefined;
  }
  if (!error) {
    return { reason: t(reasons.refused) };
  }
  switch (error.name) {
    case 'QueuePaused':
      return { reason: t(reasons.paused) };
    case 'NotUnlocked': {
      const id = error.args.id.toString();
      return { reason: t(reasons.notUnlocked, { id }), ids: [id] };
    }
    case 'AlreadyTerminal': {
      const id = error.args.id.toString();
      return { reason: t(reasons.alreadyTerminal, { id }), ids: [id] };
    }
    case 'UnknownRequest': {
      const id = error.args.id.toString();
      return { reason: t(reasons.unknownRequest, { id }), ids: [id] };
    }
    case 'NotExecutor':
      return { reason: t(reasons.notExecutor) };
    case 'ActorBlocked': {
      const state = BLOCK_NAMES[Number(error.args.state)];
      if (!state) {
        return { reason: t(reasons.refused) };
      }
      const actor = String(error.args.actor).toLowerCase();
      return {
        reason: t(reasons.actorBlocked, {
          address:
            actor === account.toLowerCase()
              ? t(translations.perimeterPage.releaseRefused.party.account)
              : shortAddress(error.args.actor),
          state: t(translations.perimeterPage.releaseRefused.state[state]),
        }),
        ids: rows
          .filter(row =>
            [row.originator, row.owner, row.receiver].some(
              address => address.toLowerCase() === actor,
            ),
          )
          .map(row => row.id),
      };
    }
    default:
      return { reason: t(reasons.refused) };
  }
};

/** A release's calldata: one id as `executeExit`, a batch as `executeExits`. */
const releaseData = (rows: ReleaseRow[], single: boolean): string =>
  single
    ? QUEUE_RELEASES.encodeFunctionData('executeExit', [rows[0].id])
    : QUEUE_RELEASES.encodeFunctionData('executeExits', [
        rows.map(row => row.id),
      ]);

type DryRun = { kind: 'accepted' } | ({ kind: 'refused' } & Refusal);

/**
 * Ask the queue, with `eth_call` from the holder's own address, whether it
 * would accept this release now. A dry run that could not be completed is a
 * refusal too: an unanswered check is not a yes.
 */
const dryRun = async (
  rows: ReleaseRow[],
  single: boolean,
  account: string,
): Promise<DryRun> => {
  try {
    const outcome = await callRaw(getProvider(RSK_CHAIN_ID), {
      from: account,
      to: rows[0].queueAddress,
      data: releaseData(rows, single),
    });
    if (outcome.kind === 'result') {
      return { kind: 'accepted' };
    }
    if (outcome.kind === 'reverted') {
      return { kind: 'refused', ...refusalOf(outcome.data, rows, account) };
    }
  } catch (error) {
    // Treated below as a dry run that could not be completed.
  }
  return {
    kind: 'refused',
    reason: t(translations.perimeterPage.releaseRefused.reason.unchecked),
  };
};

/**
 * Dry-run one queue's release, dropping what the queue refuses by name.
 *
 * `executeExits` is atomic, so one withdrawal the queue refuses would take the
 * others down with it. A refusal that names withdrawals — not yet unlocked,
 * already delivered, unknown to the queue, or with a blocked party — drops
 * those, and the queue is asked again about the rest. A refusal that holds for
 * the whole call, or a dry run that could not be completed, sends nothing from
 * this queue. Every pass drops at least one row or stops, so this ends.
 */
const askQueue = async (
  rows: ReleaseRow[],
  single: boolean,
  account: string,
): Promise<{ accepted: ReleaseRow[]; refusals: string[] }> => {
  const refusals: string[] = [];
  let remaining = rows;
  while (remaining.length > 0) {
    const outcome = await dryRun(remaining, single, account);
    if (outcome.kind === 'accepted') {
      return { accepted: remaining, refusals };
    }
    const named = outcome.ids ?? [];
    const refused = remaining.filter(row => named.includes(row.id));
    if (refused.length === 0) {
      refusals.push(rowsRefusal(remaining, outcome.reason));
      return { accepted: [], refusals };
    }
    refusals.push(rowsRefusal(refused, outcome.reason));
    remaining = remaining.filter(row => !named.includes(row.id));
  }
  return { accepted: [], refusals };
};

/** Rows grouped by the queue that holds them: a queue accepts only its own ids. */
const byQueue = (rows: ReleaseRow[]): ReleaseRow[][] => {
  const groups = new Map<string, ReleaseRow[]>();
  rows.forEach(row =>
    groups.set(row.queueAddress, [
      ...(groups.get(row.queueAddress) ?? []),
      row,
    ]),
  );
  return [...groups.values()];
};

type ReleaseCheck = {
  /** Rows whose status is not Queued: someone has delivered them. */
  delivered: ReleaseRow[];
  /** One line per withdrawal, or group of withdrawals, not released, and why. */
  refusals: string[];
  /** Whether the dry run asked about `executeExit` rather than `executeExits`. */
  single: boolean;
  /** Per queue, the rows its dry run accepted. */
  accepted: ReleaseRow[][];
};

/**
 * The release check: each row's status and each party's block state read
 * fresh, then the queue's own dry run from the holder's address.
 *
 * `single` names the call that will be sent. When it is not given, one row
 * left after the reads is asked about as `executeExit`, and more as
 * `executeExits`.
 */
const checkRelease = async (
  rows: ReleaseRow[],
  account: string,
  single?: boolean,
): Promise<ReleaseCheck> => {
  const refusals: string[] = [];

  const statuses = await Promise.all(rows.map(readStatus));
  const delivered: ReleaseRow[] = [];
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
      delivered.push(row);
      return false;
    }
    return true;
  });

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

  const asSingle = single ?? clear.length === 1;
  const asked = await Promise.all(
    byQueue(clear).map(queueRows => askQueue(queueRows, asSingle, account)),
  );
  asked.forEach(outcome => refusals.push(...outcome.refusals));

  return {
    delivered,
    refusals,
    single: asSingle,
    accepted: asked
      .map(outcome => outcome.accepted)
      .filter(queueRows => queueRows.length > 0),
  };
};

/**
 * The gas a release needs, estimated from the holder's address for exactly
 * these rows. Undefined when no estimate is obtained: a release is never sent
 * on a guessed limit.
 */
const estimateReleaseGas = async (
  rows: ReleaseRow[],
  single: boolean,
  account: string,
): Promise<string | undefined> => {
  try {
    const gas = await getProvider(RSK_CHAIN_ID).estimateGas({
      from: account,
      to: rows[0].queueAddress,
      data: releaseData(rows, single),
    });
    return gas.gt(0) ? gas.toString() : undefined;
  } catch (error) {
    return undefined;
  }
};

const notSent = () =>
  new Error('The release does not pass its check, so nothing is sent.');

/**
 * Release withdrawals from the Perimeter vault, one row or several, sending
 * only what the queue will still accept, from the network it lives on.
 *
 * The page's rows are only as fresh as its last read, and `executeExits` is
 * atomic: one id that changed since then reverts every release in its batch.
 * So the release check runs when the holder presses Release, and again inside
 * the transaction dialog's send step, immediately before the wallet is asked
 * to sign: the holder may confirm long after pressing. Each run:
 *
 * 1. asks the wallet which network it is on. A release signed on another chain
 *    reaches an address with no code, succeeds and does nothing, so on any
 *    other answer, or none, nothing is read or sent;
 * 2. reads each row's status fresh. A row whose status is not Queued has been
 *    delivered by someone else and leaves the page through `onReleased`;
 * 3. gives the rows still queued the block check. A withdrawal whose party is
 *    frozen or blacklisted looks like any other row, and this is where the
 *    block is revealed: that row is not sent;
 * 4. asks the queue, in a dry run from the holder's address, whether it would
 *    accept each queue's release, dropping each withdrawal it refuses by name.
 *
 * At the press, one notice tells the holder which withdrawals are not
 * released and why, and the rest opens in the dialog: one row as
 * `executeExit`, several grouped by queue into one transaction list. In the
 * send step the check also estimates the gas for exactly what passed. A
 * withdrawal that does not pass at that moment is named and dropped; when
 * nothing passes,
 * or the gas cannot be estimated, the wallet is not asked at all. `onReleased`
 * receives the keys (queue and id) of rows found delivered and of rows a
 * completed transaction settled.
 */
export const usePerimeterRelease = () => {
  const { account, signer } = useAccount();
  const executeExit = useExecuteExit();
  const executeExits = useExecuteExits();
  const { addNotification } = useNotificationContext();

  return useCallback(
    async (rows: ReleaseRow[], onReleased: (keys: string[]) => void) => {
      if (!account || rows.length === 0) {
        return;
      }

      const notify = (lines: string[]) =>
        addNotification(
          {
            type: NotificationType.warning,
            id: nanoid(),
            title: t(translations.perimeterPage.releaseRefused.title),
            content: (
              <>
                {lines.map(line => (
                  <p key={line}>{line}</p>
                ))}
              </>
            ),
            dismissible: true,
          },
          REFUSAL_TIMEOUT_MS,
        );

      /** Whether the wallet is on RSK; says why not when it is not. */
      const walletReady = async (): Promise<boolean> => {
        const network = await readWalletNetwork(signer);
        if (network === 'expected') {
          return true;
        }
        notify([
          t(
            network === 'other'
              ? translations.perimeterPage.releaseRefused.wrongNetwork
              : translations.perimeterPage.releaseRefused.networkUnreadable,
          ),
        ]);
        return false;
      };

      if (!(await walletReady())) {
        return;
      }

      const check = await checkRelease(rows, account);
      if (check.delivered.length > 0) {
        onReleased(check.delivered.map(exitKey));
      }
      if (check.refusals.length > 0) {
        notify(check.refusals);
      }
      if (check.accepted.length === 0) {
        return;
      }

      const pressed = new Map(rows.map(row => [exitKey(row), row]));

      const preflight =
        (single: boolean): ExitPreflight =>
        async batch => {
          if (!(await walletReady())) {
            throw notSent();
          }
          const batchRows = batch.requestIds
            .map(id =>
              pressed.get(exitKey({ queueAddress: batch.queueAddress, id })),
            )
            .filter((row): row is ReleaseRow => !!row);

          const again = await checkRelease(batchRows, account, single);
          const refusals: string[] = [];
          if (again.delivered.length > 0) {
            onReleased(again.delivered.map(exitKey));
            again.delivered.forEach(row =>
              refusals.push(
                rowsRefusal(
                  [row],
                  t(
                    translations.perimeterPage.releaseRefused.reason
                      .alreadyTerminal,
                    { id: row.id },
                  ),
                ),
              ),
            );
          }
          refusals.push(...again.refusals);

          const [passed] = again.accepted;
          const gasLimit = passed
            ? await estimateReleaseGas(passed, single, account)
            : undefined;
          if (passed && !gasLimit) {
            refusals.push(
              rowsRefusal(
                passed,
                t(
                  translations.perimeterPage.releaseRefused.reason
                    .gasUnestimated,
                ),
              ),
            );
          }

          if (refusals.length > 0) {
            notify(refusals);
          }
          if (!passed || !gasLimit) {
            throw notSent();
          }
          return { requestIds: passed.map(row => row.id), gasLimit };
        };

      if (check.single) {
        const [[row]] = check.accepted;
        await executeExit(row.queueAddress, row.id, {
          preflight: preflight(true),
          onComplete: () => onReleased([exitKey(row)]),
        });
        return;
      }
      await executeExits(
        check.accepted.map(queueRows => ({
          queueAddress: queueRows[0].queueAddress,
          requestIds: queueRows.map(queueRow => queueRow.id),
        })),
        {
          preflight: preflight(false),
          onComplete: batch =>
            onReleased(
              batch.requestIds.map(id =>
                exitKey({ queueAddress: batch.queueAddress, id }),
              ),
            ),
        },
      );
    },
    [account, addNotification, executeExit, executeExits, signer],
  );
};
