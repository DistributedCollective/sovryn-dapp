import React, { useCallback } from 'react';

import { BigNumber, Contract, providers, utils } from 'ethers';
import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { getProvider } from '@sovryn/ethers-provider';
import { NotificationType } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../config/chains';

import { sendRefusal } from '../../app/3_organisms/TransactionStepDialog/helpers';
import { useNotificationContext } from '../../contexts/NotificationContext';
import { translations } from '../../locales/i18n';
import {
  BlockState,
  ExitStatus,
  PendingExit,
  RELEASE_GAS_MARGIN_PERCENT,
  RELEASE_READ_TIMEOUT_MS,
  exitKey,
} from '../../utils/exitDelay';
import { useAccount } from '../useAccount';
import { boundedBy, callRaw } from './rawCall';
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

type WalletState =
  | 'ready'
  | 'otherNetwork'
  | 'networkUnreadable'
  | 'otherAccount'
  | 'accountUnreadable';

/** What the holder is told when the wallet is not ready to release. */
const WALLET_REFUSALS: Record<Exclude<WalletState, 'ready'>, string> = {
  otherNetwork: translations.perimeterPage.releaseRefused.wrongNetwork,
  networkUnreadable:
    translations.perimeterPage.releaseRefused.networkUnreadable,
  otherAccount: translations.perimeterPage.releaseRefused.accountChanged,
  accountUnreadable:
    translations.perimeterPage.releaseRefused.accountUnreadable,
};

/**
 * Whether the wallet itself is on RSK and signs as `account`.
 *
 * The wallet is asked directly, with `eth_chainId` and then `eth_accounts`:
 * the signer's provider keeps the network it first detected, and the signer
 * resolves its address only when it signs, so a switch made in the wallet
 * shows in the wallet's own answers and nowhere else. No signer, a rejected
 * request, or an answer that is not a chain id or an account is unreadable.
 */
const readWallet = async (
  signer: providers.JsonRpcSigner | undefined,
  account: string,
): Promise<WalletState> => {
  if (!signer || typeof signer.provider?.send !== 'function') {
    return 'networkUnreadable';
  }
  try {
    const chainId = await signer.provider.send('eth_chainId', []);
    if (!BigNumber.from(chainId).eq(BigNumber.from(RSK_CHAIN_ID))) {
      return 'otherNetwork';
    }
  } catch (error) {
    return 'networkUnreadable';
  }
  try {
    const accounts: unknown = await signer.provider.send('eth_accounts', []);
    const active = Array.isArray(accounts) ? accounts[0] : undefined;
    if (typeof active !== 'string') {
      return 'accountUnreadable';
    }
    return active.toLowerCase() === account.toLowerCase()
      ? 'ready'
      : 'otherAccount';
  } catch (error) {
    return 'accountUnreadable';
  }
};

const queueReader = (queueAddress: string) =>
  new Contract(queueAddress, QUEUE_READS, getProvider(RSK_CHAIN_ID));

/** A row's status, read fresh from its queue; undefined when the read failed. */
const readStatus = async (row: ReleaseRow): Promise<number | undefined> => {
  try {
    const request = await boundedBy<{ status: number }>(
      queueReader(row.queueAddress).getRequest(row.id),
      RELEASE_READ_TIMEOUT_MS,
    );
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
      const read: Promise<number> = boundedBy(
        queue.blockStateOf(address),
        RELEASE_READ_TIMEOUT_MS,
      ).then(Number);
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

// A refusal for a blocked party says only that the release was refused: which
// party and which state are not told to whoever pressed the button.
const blockRefusal = (row: ReleaseRow, check: BlockCheck): string =>
  check.kind === 'blocked'
    ? rowsRefusal(
        [row],
        t(translations.perimeterPage.releaseRefused.reason.refused),
      )
    : t(translations.perimeterPage.releaseRefused.unreadable, { id: row.id });

/** One line naming withdrawals that are not released, and why. */
const rowsRefusal = (rows: ReleaseRow[], reason: string): string =>
  t(translations.perimeterPage.releaseRefused.batch, {
    count: rows.length,
    ids: rows.map(row => `#${row.id}`).join(', '),
    reason,
  });

type Refusal =
  | {
      kind: 'refused';
      reason: string;
      /** The ids the refusal names; undefined when it holds for the whole call. */
      ids?: string[];
    }
  | {
      /**
       * The named withdrawals are not unlocked in the block the dry run
       * executed in, whose timestamp can trail the page's clock.
       */
      kind: 'unlocking';
      ids: string[];
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
    return { kind: 'refused', reason: t(reasons.refused) };
  }
  switch (error.name) {
    case 'QueuePaused':
      return { kind: 'refused', reason: t(reasons.paused) };
    case 'NotUnlocked':
      return { kind: 'unlocking', ids: [error.args.id.toString()] };
    case 'AlreadyTerminal': {
      const id = error.args.id.toString();
      return {
        kind: 'refused',
        reason: t(reasons.alreadyTerminal, { id }),
        ids: [id],
      };
    }
    case 'UnknownRequest': {
      const id = error.args.id.toString();
      return {
        kind: 'refused',
        reason: t(reasons.unknownRequest, { id }),
        ids: [id],
      };
    }
    case 'NotExecutor':
      return { kind: 'refused', reason: t(reasons.notExecutor) };
    case 'ActorBlocked': {
      // Which party, and whether frozen or blacklisted, is not said here.
      const actor = String(error.args.actor).toLowerCase();
      return {
        kind: 'refused',
        reason: t(reasons.refused),
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
      return { kind: 'refused', reason: t(reasons.refused) };
  }
};

/** A release's calldata: one id as `executeExit`, a batch as `executeExits`. */
const releaseData = (rows: ReleaseRow[], single: boolean): string =>
  single
    ? QUEUE_RELEASES.encodeFunctionData('executeExit', [rows[0].id])
    : QUEUE_RELEASES.encodeFunctionData('executeExits', [
        rows.map(row => row.id),
      ]);

type DryRun = { kind: 'accepted' } | Refusal;

/**
 * Whether an address carries code, read fresh; undefined when the read did not
 * complete or its answer is not hex.
 */
const readHasCode = async (address: string): Promise<boolean | undefined> => {
  try {
    const length = utils.hexDataLength(
      await boundedBy(
        getProvider(RSK_CHAIN_ID).getCode(address),
        RELEASE_READ_TIMEOUT_MS,
      ),
    );
    return length === null ? undefined : length > 0;
  } catch (error) {
    return undefined;
  }
};

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
    const outcome = await callRaw(
      getProvider(RSK_CHAIN_ID),
      {
        from: account,
        to: rows[0].queueAddress,
        data: releaseData(rows, single),
      },
      // The release functions return nothing: an executed release answers
      // with empty data, and any other result is not the queue's yes.
      result => result === '0x',
      RELEASE_READ_TIMEOUT_MS,
    );
    if (outcome.kind === 'result') {
      return { kind: 'accepted' };
    }
    if (outcome.kind === 'reverted') {
      return refusalOf(outcome.data, rows, account);
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
 * others down with it. A refusal that names withdrawals — already delivered,
 * unknown to the queue, or with a blocked party — drops those, and the queue
 * is asked again about the rest. A withdrawal not yet unlocked in the latest
 * block is dropped the same way and set aside as unlocking. A refusal that
 * holds for the whole call, or a dry run that could not be completed, sends
 * nothing from this queue. Every pass drops at least one row or stops, so this
 * ends.
 *
 * Nothing is asked of an address without code, or whose code could not be
 * read: a call to it executes nothing and answers with the same empty data an
 * accepted release gives.
 */
const askQueue = async (
  rows: ReleaseRow[],
  single: boolean,
  account: string,
): Promise<{
  accepted: ReleaseRow[];
  unlocking: ReleaseRow[];
  refusals: string[];
}> => {
  const refusals: string[] = [];
  const unlocking: ReleaseRow[] = [];
  if ((await readHasCode(rows[0].queueAddress)) !== true) {
    refusals.push(
      rowsRefusal(
        rows,
        t(translations.perimeterPage.releaseRefused.reason.unchecked),
      ),
    );
    return { accepted: [], unlocking, refusals };
  }
  let remaining = rows;
  while (remaining.length > 0) {
    const outcome = await dryRun(remaining, single, account);
    if (outcome.kind === 'accepted') {
      return { accepted: remaining, unlocking, refusals };
    }
    const named = outcome.ids ?? [];
    const dropped = remaining.filter(row => named.includes(row.id));
    if (dropped.length === 0) {
      refusals.push(
        rowsRefusal(
          remaining,
          outcome.kind === 'refused'
            ? outcome.reason
            : t(translations.perimeterPage.releaseRefused.reason.refused),
        ),
      );
      return { accepted: [], unlocking, refusals };
    }
    if (outcome.kind === 'unlocking') {
      unlocking.push(...dropped);
    } else {
      refusals.push(rowsRefusal(dropped, outcome.reason));
    }
    remaining = remaining.filter(row => !named.includes(row.id));
  }
  return { accepted: [], unlocking, refusals };
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
  /** Rows paid to their receiver: someone has delivered them. */
  delivered: ReleaseRow[];
  /** Rows the queue resolved away by recovery; each is named in `refusals`. */
  resolved: ReleaseRow[];
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
  const resolved: ReleaseRow[] = [];
  const queued = rows.filter((row, index) => {
    switch (statuses[index]) {
      case ExitStatus.Queued:
        return true;
      case ExitStatus.Executed:
        delivered.push(row);
        return false;
      case ExitStatus.ResolvedToProtocol:
        resolved.push(row);
        refusals.push(
          t(translations.perimeterPage.releaseRefused.resolvedToProtocol, {
            id: row.id,
          }),
        );
        return false;
      case ExitStatus.ResolvedByOwner:
        resolved.push(row);
        refusals.push(
          t(translations.perimeterPage.releaseRefused.resolvedByOwner, {
            id: row.id,
          }),
        );
        return false;
      default:
        // A read that failed, None from a node that does not hold the
        // request, or a value outside the known ones: nothing is known about
        // the withdrawal, so nothing is sent and the row stays.
        refusals.push(
          t(translations.perimeterPage.releaseRefused.statusUnreadable, {
            id: row.id,
          }),
        );
        return false;
    }
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
  const unlocking = asked.flatMap(outcome => outcome.unlocking);
  if (unlocking.length > 0) {
    refusals.push(
      t(translations.perimeterPage.releaseRefused.unlocking, {
        count: unlocking.length,
        ids: unlocking.map(row => `#${row.id}`).join(', '),
      }),
    );
  }

  return {
    delivered,
    resolved,
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
): Promise<BigNumber | undefined> => {
  try {
    const gas = await boundedBy(
      getProvider(RSK_CHAIN_ID).estimateGas({
        from: account,
        to: rows[0].queueAddress,
        data: releaseData(rows, single),
      }),
      RELEASE_READ_TIMEOUT_MS,
    );
    return gas.gt(0) ? gas : undefined;
  } catch (error) {
    return undefined;
  }
};

/**
 * A limit the holder typed in Advanced settings, kept only when it is at
 * least the fresh estimate; undefined when it is below the estimate, or not a
 * whole number, so the release is not sent on it.
 */
const typedReleaseGasLimit = (
  estimate: BigNumber,
  typedGasLimit: string,
): string | undefined => {
  try {
    const typed = BigNumber.from(typedGasLimit);
    return typed.gte(estimate) ? typed.toString() : undefined;
  } catch (error) {
    return undefined;
  }
};

/**
 * The latest block's own gas limit, read fresh; undefined when the read did
 * not complete.
 */
const readBlockGasLimit = async (): Promise<BigNumber | undefined> => {
  try {
    const block = await boundedBy(
      getProvider(RSK_CHAIN_ID).getBlock('latest'),
      RELEASE_READ_TIMEOUT_MS,
    );
    return block?.gasLimit;
  } catch (error) {
    return undefined;
  }
};

type AutoGasLimit =
  | { kind: 'ok'; gasLimit: string }
  /** The latest block's own gas limit could not be read. */
  | { kind: 'blockUnreadable' }
  /** The estimate alone is above the latest block's own gas limit: no margin can be sent. */
  | { kind: 'tooLarge' };

/**
 * The gas limit an untyped release is sent with: the fresh estimate plus
 * `RELEASE_GAS_MARGIN_PERCENT`, never above the latest block's own gas limit.
 * The block's own gas limit is read fresh, because the margin is added for a
 * release that executes in a later block, and that block's own limit can
 * change between reads. An estimate that alone is above it cannot be sent at
 * any margin, and a block read that does not complete leaves the ceiling
 * unknown, so neither is sent on a guess.
 */
const autoReleaseGasLimit = async (
  estimate: BigNumber,
): Promise<AutoGasLimit> => {
  const blockGasLimit = await readBlockGasLimit();
  if (!blockGasLimit) {
    return { kind: 'blockUnreadable' };
  }
  if (estimate.gt(blockGasLimit)) {
    return { kind: 'tooLarge' };
  }
  const withMargin = estimate.mul(100 + RELEASE_GAS_MARGIN_PERCENT).div(100);
  return {
    kind: 'ok',
    gasLimit: (withMargin.lt(blockGasLimit)
      ? withMargin
      : blockGasLimit
    ).toString(),
  };
};

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
 * 1. asks the wallet which network it is on and which account it signs as. A
 *    release signed on another chain reaches an address with no code,
 *    succeeds and does nothing, and one signed by an account other than the
 *    one checked reverts, so on any other answer, or none, nothing is read or
 *    sent;
 * 2. reads each row's status fresh. A row paid to its receiver by someone else
 *    leaves the page through `onReleased`; a row resolved away by recovery
 *    leaves it too, and is named with what happened to it. A status that says
 *    nothing about the request, or no answer, keeps the row and sends nothing;
 * 3. gives the rows still queued the block check. A withdrawal whose party is
 *    frozen or blacklisted looks like any other row, and this is where the
 *    block is revealed: that row is not sent;
 * 4. asks the queue, in a dry run from the holder's address, whether it would
 *    accept each queue's release, dropping each withdrawal it refuses by name.
 *
 * Each chain read a run makes gives up after `RELEASE_READ_TIMEOUT_MS`, and a
 * read that gives up refuses like one that failed.
 *
 * At the press, one notice tells the holder which withdrawals are not
 * released and why, and the rest opens in the dialog: one row as
 * `executeExit`, several grouped by queue into one transaction list. In the
 * send step the check also estimates the gas for exactly what passed and sets
 * the gas limit from that estimate, capped at the latest block's own gas
 * limit (`autoReleaseGasLimit`), and reads the wallet once more as its last
 * step. A withdrawal that does not pass at that moment is named and dropped.
 * When nothing passes, the gas cannot be estimated, its own gas limit could
 * not be checked, a gas limit the holder typed is below the estimate, or the
 * wallet signs as
 * another account, the wallet is not asked at all; otherwise it is handed the
 * release from the account the check ran for. `onReleased` receives the keys
 * (queue and id) of rows found delivered
 * and of rows a completed transaction settled.
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

      /**
       * Why the wallet is not ready to release — not on RSK, or not signing as
       * `account` — or undefined when it is.
       */
      const walletRefusal = async (): Promise<string | undefined> => {
        const wallet = await readWallet(signer, account);
        if (wallet === 'ready') {
          return undefined;
        }
        const refusal: string = t(WALLET_REFUSALS[wallet]);
        return refusal;
      };

      /**
       * Refuse a send step: the holder is told why in the notice, and the
       * dialog is handed the same lines to say why nothing was sent.
       */
      const refuseSend = (lines: string[]) => {
        if (lines.length > 0) {
          notify(lines);
        }
        return sendRefusal(lines);
      };

      const walletAtPress = await walletRefusal();
      if (walletAtPress) {
        notify([walletAtPress]);
        return;
      }

      const check = await checkRelease(rows, account);
      const settled = [...check.delivered, ...check.resolved];
      if (settled.length > 0) {
        onReleased(settled.map(exitKey));
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
        async (batch, typedGasLimit) => {
          const walletAtSend = await walletRefusal();
          if (walletAtSend) {
            throw refuseSend([walletAtSend]);
          }
          const batchRows = batch.requestIds
            .map(id =>
              pressed.get(exitKey({ queueAddress: batch.queueAddress, id })),
            )
            .filter((row): row is ReleaseRow => !!row);

          const again = await checkRelease(batchRows, account, single);
          const refusals: string[] = [];
          const settledAgain = [...again.delivered, ...again.resolved];
          if (settledAgain.length > 0) {
            onReleased(settledAgain.map(exitKey));
          }
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
          refusals.push(...again.refusals);

          const [passed] = again.accepted;
          const estimate = passed
            ? await estimateReleaseGas(passed, single, account)
            : undefined;

          const reasons = translations.perimeterPage.releaseRefused.reason;
          /** "We could not get it a usable gas limit": the batch-aware ending. */
          const noUsableGasLimit = () =>
            t(
              passed && passed.length > 1
                ? reasons.gasUnestimatedBatch
                : reasons.gasUnestimated,
            );

          let gasLimit: string | undefined;
          if (passed && estimate && typedGasLimit !== undefined) {
            gasLimit = typedReleaseGasLimit(estimate, typedGasLimit);
            if (!gasLimit) {
              refusals.push(
                rowsRefusal(
                  passed,
                  t(reasons.gasLimitTooLow, {
                    limit: typedGasLimit,
                    needed: estimate.toString(),
                  }),
                ),
              );
            }
          } else if (passed && estimate) {
            const auto = await autoReleaseGasLimit(estimate);
            if (auto.kind === 'ok') {
              gasLimit = auto.gasLimit;
            } else if (auto.kind === 'blockUnreadable') {
              refusals.push(rowsRefusal(passed, t(reasons.gasLimitUnreadable)));
            } else {
              refusals.push(rowsRefusal(passed, noUsableGasLimit()));
            }
          } else if (passed && !estimate) {
            refusals.push(rowsRefusal(passed, noUsableGasLimit()));
          }

          // The wallet is read once more, as the last step before it is asked
          // to sign: an account switched during the reads above cancels the
          // send.
          const walletAtSign =
            passed && gasLimit ? await walletRefusal() : undefined;
          if (walletAtSign) {
            throw refuseSend([walletAtSign]);
          }
          if (!passed || !gasLimit) {
            throw refuseSend(refusals);
          }
          if (refusals.length > 0) {
            notify(refusals);
          }
          return {
            requestIds: passed.map(row => row.id),
            gasLimit,
            from: account,
          };
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
