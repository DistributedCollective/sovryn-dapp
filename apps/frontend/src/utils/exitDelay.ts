import { Decimal } from '@sovryn/utils';

/** 30 s — the perimeter's operational admin can change policy instantly (no timelock), so cache briefly. */
export const EXIT_DELAY_TTL = 30_000;

/**
 * How long each chain read a release check makes may take before the check
 * gives up on it and refuses, saying what it could not check. Without a bound
 * a node that never answers holds the release for ethers' two-minute timeout.
 */
export const RELEASE_READ_TIMEOUT_MS = 10_000;

/**
 * How far above the node's fresh gas estimate a release's gas limit is set, in
 * percent, when the holder typed no limit: the estimate is made against the
 * state the check read, and the release executes in a later block.
 */
export const RELEASE_GAS_MARGIN_PERCENT = 20;

/**
 * How long history waits before reading a withdrawal released earlier this
 * session a second time, when the first read still finds it queued.
 */
export const HISTORY_SETTLING_RETRY_MS = 3_000;

/** Mirrors ExitDelayQueue.ExitStatus. */
export enum ExitStatus {
  None = 0,
  Queued = 1,
  Executed = 2,
  ResolvedToProtocol = 3,
  ResolvedByOwner = 4,
}

/** Mirrors ExitDelayQueue.BlockState. */
export enum BlockState {
  None = 0,
  Frozen = 1,
  Blacklisted = 2,
}

/**
 * What the holder can actually do with a queued exit right now. Derived from
 * the same conditions `executeExit` checks on-chain, in the order it checks
 * them, so the UI never offers a button that would revert.
 */
export enum PendingExitState {
  /** Still inside its delay window. */
  Locked = 'locked',
  /**
   * Past its unlock time on the page's ticking clock, but the latest block read
   * is still before it. The queue compares that block's timestamp, so a release
   * is refused until a block reaches the unlock time.
   */
  Unlocking = 'unlocking',
  /** Past its unlock time and executable by this account. */
  Unlocked = 'unlocked',
  /** Past its unlock time, but this account is not an executor for it. */
  NotExecutor = 'notExecutor',
  /**
   * Past its unlock time, but a party to it is frozen while it is looked
   * into. The holder waits; nothing is lost.
   */
  Frozen = 'frozen',
  /** The whole queue is paused. */
  Paused = 'paused',
  /** Paid out to its receiver. */
  Settled = 'settled',
  /**
   * The queue's answer for this request was the zero value, meaning it holds
   * no such request at all, or a value outside the five it defines. Neither
   * is a stated outcome: the row is kept and read this way rather than as
   * Settled, which would tell the holder their money already arrived.
   */
  Unreadable = 'unreadable',
  /** Sent by the Owner to a recovery destination it chose. */
  ResolvedByOwner = 'resolvedByOwner',
  /** Sent to a recovery destination approved in advance for its product. */
  ResolvedToProtocol = 'resolvedToProtocol',
}

export type PendingExit = {
  id: string;
  /** The queue holding this exit — the contract a release is sent to. */
  queueAddress: string;
  /**
   * The escrowed amount in the asset's own units. Undefined when the asset
   * could not be resolved: its decimals are then unknown, and a number scaled
   * by a guess would be silently wrong by orders of magnitude.
   */
  amount?: Decimal;
  /** Symbol of the asset the holder receives, undefined when unresolved. */
  tokenSymbol?: string;
  /** address(0) means native RBTC. */
  token: string;
  createdAt: number;
  unlockAt: number;
  originator: string;
  owner: string;
  receiver: string;
  surfaceId: string;
  subProduct: string;
  status: ExitStatus;
  unwrapOnDelivery: boolean;
  /**
   * Whether the recorded owner address carries code, per `extcodesize`. The
   * queue lets anyone deliver such a request, so the page can note that
   * instead of asking the holder to press anything. Undefined when the code
   * read did not complete.
   */
  ownerHasCode?: boolean;
  /**
   * The block state on one of the request's parties, when one is set; a
   * frozen party wins over a blacklisted one. Undefined when no party is
   * stated as frozen or blacklisted, whether every read completed clear or
   * one of them did not complete at all — `blockedStateUnreadable` carries
   * that difference.
   */
  blockedState?: BlockState;
  /**
   * True when at least one party's own block-state read did not complete,
   * and no party is stated as frozen or blacklisted. Undefined block state
   * alone cannot tell a party confirmed clear apart from one never read.
   */
  blockedStateUnreadable?: boolean;
};

/**
 * An exit's identity on the page: its queue and its id. Ids restart in each
 * queue, so an id alone can name two different requests.
 */
export const exitKey = (
  exit: Pick<PendingExit, 'queueAddress' | 'id'>,
): string => `${exit.queueAddress.toLowerCase()}:${exit.id}`;

/**
 * A hold quote, including whether we managed to get one.
 *
 * `unknown` exists because the delay fails CLOSED on chain — the mirror image
 * of the fee. When a controller is pinned but cannot be quoted,
 * `PerimeterLib.safeQuoteDelay` reverts the whole withdrawal
 * (`PERIMETER:delay-quote-failed`) rather than paying direct. So a read that
 * did not complete means one of two things — the money is held, or the
 * transaction fails — and never "paid straight to the wallet". Zero is a
 * truthful answer only where the perimeter is unwired, which is a different
 * fact and is reported with `unknown: false`.
 */
export type ExitDelayQuote = {
  /** Seconds the perimeter will hold this withdrawal. 0 means paid directly. */
  delaySeconds: number;
  loading: boolean;
  /** True when no quote was obtained. NOT the same as a delay of zero. */
  unknown: boolean;
};

/** A settled quote saying nothing is held: the shape callers pass to suppress the hold UI. */
export const NO_EXIT_DELAY: ExitDelayQuote = {
  delaySeconds: 0,
  loading: false,
  unknown: false,
};

/**
 * Deliberately NOT exported. It answers "does the perimeter hold this" and only
 * that, so on its own it cannot tell a hold of zero from a hold nobody could
 * read — and silence is truthful only for the first. `getExitDelayDisplay` is
 * the exported entry point; keeping this private makes the mistake a compile
 * error instead of a bug a caller could introduce unnoticed.
 */
const isExitDelayShown = (delaySeconds: number): boolean => delaySeconds > 0;

/**
 * What the UI shows: the hold rows, a note that the quote is still being
 * checked, an admission that we could not check, or nothing at all.
 *
 * `held` and `none` are the two answers the chain stated. `unknown` is the one
 * it did not, and `checking` is the one it has not yet: unlike the fee, an
 * unread delay is not equivalent to no delay, so neither borrows silence from
 * a fact we do not have. Silence is reserved for `none`.
 */
export type ExitDelayDisplay = 'held' | 'unknown' | 'checking' | 'none';

export const getExitDelayDisplay = (
  quote: ExitDelayQuote,
): ExitDelayDisplay => {
  if (quote.loading) {
    return 'checking';
  }
  if (quote.unknown) {
    return 'unknown';
  }
  return isExitDelayShown(quote.delaySeconds) ? 'held' : 'none';
};

/**
 * Whole-unit duration for display: days, then hours, then minutes, then
 * seconds. Rounded UP, because a delay shown as shorter than it is would be
 * read as a promise the contract does not make.
 */
export const formatDelayDuration = (
  seconds: number,
): { value: number; unit: 'days' | 'hours' | 'minutes' | 'seconds' } => {
  if (seconds <= 0) {
    return { value: 0, unit: 'seconds' };
  }
  if (seconds >= 86_400) {
    return { value: Math.ceil(seconds / 86_400), unit: 'days' };
  }
  if (seconds >= 3_600) {
    return { value: Math.ceil(seconds / 3_600), unit: 'hours' };
  }
  if (seconds >= 60) {
    return { value: Math.ceil(seconds / 60), unit: 'minutes' };
  }
  return { value: seconds, unit: 'seconds' };
};

type DelayUnit = 'days' | 'hours' | 'minutes' | 'seconds';

const UNIT_SECONDS: [DelayUnit, number][] = [
  ['days', 86_400],
  ['hours', 3_600],
  ['minutes', 60],
  ['seconds', 1],
];

/**
 * A countdown in at most two units: "1d 1h", "59m 59s", "2h".
 *
 * `formatDelayDuration` rounds a whole policy duration up to one unit, which is
 * right for a form — it never promises money sooner than it arrives — but on
 * the one screen where someone is watching a clock, 25 hours left reading as
 * "2 days" is uselessly coarse. The remainder is still rounded UP, and a
 * remainder that carries (59m 60s) rolls into the unit above rather than
 * printing an impossible count.
 */
export const formatDelayCountdown = (
  seconds: number,
): { value: number; unit: DelayUnit }[] => {
  if (seconds <= 0) {
    return [];
  }
  const index = UNIT_SECONDS.findIndex(([, size]) => seconds >= size);
  const [unit, size] = UNIT_SECONDS[index];
  let major = Math.floor(seconds / size);
  const rest = seconds - major * size;
  if (rest === 0 || unit === 'seconds') {
    return [{ value: major, unit }];
  }
  const [minorUnit, minorSize] = UNIT_SECONDS[index + 1];
  const minor = Math.ceil(rest / minorSize);
  if (minor * minorSize >= size) {
    return [{ value: major + 1, unit }];
  }
  return [
    { value: major, unit },
    { value: minor, unit: minorUnit },
  ];
};

/** Seconds remaining until an exit unlocks; never negative. */
export const secondsUntilUnlock = (unlockAt: number, now: number): number =>
  Math.max(0, unlockAt - now);

/**
 * Whether the given account is one of THIS account's own executors,
 * `{originator, owner}` — the receiver is NEVER an executor. When the owner
 * has code, the queue also lets anyone else deliver the request; that does
 * not change what this check reports for the connected account.
 */
export const isExecutor = (
  exit: Pick<PendingExit, 'originator' | 'owner'>,
  account: string | undefined,
): boolean => {
  if (!account) {
    return false;
  }
  const a = account.toLowerCase();
  return exit.originator.toLowerCase() === a || exit.owner.toLowerCase() === a;
};

/** The chain's time as the page reads it, in seconds. */
export type ChainTimes = {
  /** The latest block's own timestamp: what the queue compares. */
  blockTime: number;
  /** That timestamp advanced by the local time elapsed since the read. */
  now: number;
};

/**
 * Whether the queue actually stated this outcome, rather than answering with
 * the zero value — no such request at all — or a number outside the five it
 * defines. Both of those are a read that did not complete, never a fact about
 * the withdrawal, and must not be read as Settled.
 */
export const isStatedExitStatus = (status: number): status is ExitStatus =>
  status === ExitStatus.Queued ||
  status === ExitStatus.Executed ||
  status === ExitStatus.ResolvedToProtocol ||
  status === ExitStatus.ResolvedByOwner;

/**
 * Resolve what an exit shows right now.
 *
 * A terminal status is reported before the pause, the unlock time or the
 * executor check: a withdrawal that has already left the queue is worth
 * naming as such even while the whole perimeter happens to be paused. The
 * contract's own function checks these in a different order — the pause
 * first, then whether the request is unknown, then a non-waiting status, then
 * the unlock time, then the executor, and only then the parties' block states
 * — because it is deciding which revert to raise, not what to tell the person
 * waiting on the money; both orders are right for their own job. A status the
 * queue did not actually state — its zero value, or one outside the five it
 * defines — reads as unreadable rather than falling into Settled, which would
 * tell the holder their money already arrived. The unlock time here is judged
 * twice: the ticking clock says when the delay has ended, and the latest
 * block's own timestamp says when a release can pass, because the queue
 * compares `block.timestamp`. Between the two the exit is unlocking. A frozen
 * party shows as under investigation once the time has passed, checked here
 * ahead of the executor though the contract checks it after. A blacklisted
 * party is not given a state of its own here: its row reads Ready, same as
 * any other unlocked one. A party whose own block-state read did not
 * complete, with no party stated as frozen or blacklisted, reads as
 * unreadable rather than falling into Ready, which would tell the holder a
 * check that never ran came back clear.
 */
export const getPendingExitState = (
  exit: Pick<
    PendingExit,
    | 'status'
    | 'unlockAt'
    | 'originator'
    | 'owner'
    | 'blockedState'
    | 'blockedStateUnreadable'
  >,
  paused: boolean,
  account: string | undefined,
  { now, blockTime }: ChainTimes,
): PendingExitState => {
  if (exit.status === ExitStatus.ResolvedByOwner) {
    return PendingExitState.ResolvedByOwner;
  }
  if (exit.status === ExitStatus.ResolvedToProtocol) {
    return PendingExitState.ResolvedToProtocol;
  }
  if (!isStatedExitStatus(exit.status)) {
    return PendingExitState.Unreadable;
  }
  if (exit.status !== ExitStatus.Queued) {
    return PendingExitState.Settled;
  }
  if (paused) {
    return PendingExitState.Paused;
  }
  if (now < exit.unlockAt) {
    return PendingExitState.Locked;
  }
  if (blockTime < exit.unlockAt) {
    return PendingExitState.Unlocking;
  }
  if (exit.blockedState === BlockState.Frozen) {
    return PendingExitState.Frozen;
  }
  if (exit.blockedStateUnreadable) {
    return PendingExitState.Unreadable;
  }
  return isExecutor(exit, account)
    ? PendingExitState.Unlocked
    : PendingExitState.NotExecutor;
};

export const canExecuteExit = (state: PendingExitState): boolean =>
  state === PendingExitState.Unlocked;
