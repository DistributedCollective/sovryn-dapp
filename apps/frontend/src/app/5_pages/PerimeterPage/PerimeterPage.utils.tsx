import { t } from 'i18next';

import { translations } from '../../../locales/i18n';
import {
  PendingExit,
  PendingExitState,
  formatDelayCountdown,
  secondsUntilUnlock,
} from '../../../utils/exitDelay';

/**
 * Every row carries the state it is in, resolved once, so the table and its
 * action button can never disagree about whether an exit is releasable.
 */
export type PerimeterExitRow = PendingExit & {
  state: PendingExitState;
};

export const getStatusLabel = (state: PendingExitState): string =>
  t(translations.perimeterPage.status[state]);

export const getStatusTooltip = (state: PendingExitState): string =>
  t(translations.perimeterPage.statusTooltip[state]);

/** States a row settles into for good: nothing is ever released from them. */
const NEVER_RELEASED_STATES = new Set<PendingExitState>([
  PendingExitState.Settled,
  PendingExitState.ResolvedByOwner,
  PendingExitState.ResolvedToProtocol,
  PendingExitState.Unreadable,
]);

/**
 * Time left on a hold, to two units ("1d 1h"). An exit past its unlock time
 * reads as ready rather than as "0 seconds", which would look like a stuck row.
 *
 * The form states a policy duration and rounds it to one whole unit; this is
 * the screen where someone watches the clock, so it says what is actually left.
 *
 * A row in one of the states nothing is ever released from carries no release
 * time at all: an unlock time in the past reads as due now regardless of what
 * became of the row, which is a readiness claim the row's own status denies.
 */
export const getTimeToRelease = (
  unlockAt: number,
  now: number,
  state: PendingExitState,
): string => {
  if (NEVER_RELEASED_STATES.has(state)) {
    return '-';
  }
  const remaining = secondsUntilUnlock(unlockAt, now);
  if (remaining === 0) {
    return t(translations.perimeterPage.readyNow);
  }
  return formatDelayCountdown(remaining)
    .map(({ value, unit }) =>
      t(translations.exitDelay.durationShort[unit], { count: value }),
    )
    .join(' ');
};

/** Shorten an address for a table cell without hiding which address it is. */
export const shortenAddress = (address: string): string =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;
