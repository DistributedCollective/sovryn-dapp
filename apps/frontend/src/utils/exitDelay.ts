import { Decimal } from '@sovryn/utils';

/** 30 s — the perimeter's operational admin can change policy instantly (no timelock), so cache briefly. */
export const EXIT_DELAY_TTL = 30_000;

/** Mirrors ExitDelayQueue.ExitStatus. */
export enum ExitStatus {
  None = 0,
  Queued = 1,
  Executed = 2,
  ResolvedToProtocol = 3,
  ResolvedBySIP = 4,
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
  /** Past its unlock time and executable by this account. */
  Unlocked = 'unlocked',
  /** Past its unlock time, but this account is not an executor for it. */
  NotExecutor = 'notExecutor',
  /** One of the parties is frozen or blacklisted. */
  Blocked = 'blocked',
  /** The whole queue is paused. */
  Paused = 'paused',
  /** Already paid out, or resolved away by recovery or governance. */
  Settled = 'settled',
}

export type PendingExit = {
  id: string;
  amount: Decimal;
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
};

export type PartyBlockStates = {
  originator: BlockState;
  owner: BlockState;
  receiver: BlockState;
};

/** A delay row is worth rendering only when the perimeter actually holds funds back. */
export const isExitDelayShown = (delaySeconds: number): boolean =>
  delaySeconds > 0;

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

/** Seconds remaining until an exit unlocks; never negative. */
export const secondsUntilUnlock = (unlockAt: number, now: number): number =>
  Math.max(0, unlockAt - now);

/** The executor set is `{originator, owner}` — the receiver is NEVER an executor. */
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

const anyBlocked = (blocks: PartyBlockStates): boolean =>
  blocks.originator !== BlockState.None ||
  blocks.owner !== BlockState.None ||
  blocks.receiver !== BlockState.None;

/**
 * Resolve what an exit can do right now.
 *
 * Order matters and follows `_executeOne`: a terminal status wins over
 * everything, then the global pause, then the unlock time, then the block
 * gate, then the executor check. Reordering would let the UI show "ready" for
 * an exit the contract would refuse.
 */
export const getPendingExitState = (
  exit: Pick<PendingExit, 'status' | 'unlockAt' | 'originator' | 'owner'>,
  blocks: PartyBlockStates,
  paused: boolean,
  account: string | undefined,
  now: number,
): PendingExitState => {
  if (exit.status !== ExitStatus.Queued) {
    return PendingExitState.Settled;
  }
  if (paused) {
    return PendingExitState.Paused;
  }
  if (now < exit.unlockAt) {
    return PendingExitState.Locked;
  }
  if (anyBlocked(blocks)) {
    return PendingExitState.Blocked;
  }
  return isExecutor(exit, account)
    ? PendingExitState.Unlocked
    : PendingExitState.NotExecutor;
};

export const canExecuteExit = (state: PendingExitState): boolean =>
  state === PendingExitState.Unlocked;
