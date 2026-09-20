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

// A paused row's own tooltip speaks about that row, not about every queue the
// page follows; the whole-perimeter sentence stays with the banner, which is
// the one place it is true of everything listed.
export const getStatusTooltip = (state: PendingExitState): string =>
  t(
    state === PendingExitState.Paused
      ? translations.perimeterPage.pausedRowTooltip
      : translations.perimeterPage.statusTooltip[state],
  );

/**
 * Time left on a hold, to two units ("1d 1h"). An exit past its unlock time
 * reads as ready rather than as "0 seconds", which would look like a stuck row.
 *
 * The form states a policy duration and rounds it to one whole unit; this is
 * the screen where someone watches the clock, so it says what is actually left.
 *
 * A row nothing is ever released from — its block state could not be read,
 * or it reached here with a status the pending list should already have
 * dropped it for — carries no release time at all: an unlock time in the
 * past reads as due now regardless of what became of the row, which is a
 * readiness claim the row's own status denies.
 */
export const getTimeToRelease = (
  unlockAt: number,
  now: number,
  state: PendingExitState,
): string => {
  if (state === PendingExitState.Unreadable) {
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

/** Every key the retired per-device history wrote local storage under. */
const LEGACY_HISTORY_KEY_PREFIX = 'perimeter/history/';

/**
 * Withdrawal history is no longer kept in this browser: clear whatever the
 * retired per-device history left behind, for every chain and account it was
 * ever written under, so nothing stale lingers once this page has loaded.
 * Never throws: a store that cannot be read or written leaves nothing to
 * clear, and this is a convenience, never a statement about funds.
 */
export const clearLegacyHistoryKeys = (): void => {
  try {
    const stale: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(LEGACY_HISTORY_KEY_PREFIX)) {
        stale.push(key);
      }
    }
    stale.forEach(key => window.localStorage.removeItem(key));
  } catch (error) {
    // Nothing to do: see the doc comment above.
  }
};
