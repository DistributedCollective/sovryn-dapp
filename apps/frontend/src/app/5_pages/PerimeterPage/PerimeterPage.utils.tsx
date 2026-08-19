import { t } from 'i18next';

import { translations } from '../../../locales/i18n';
import {
  PendingExit,
  PendingExitState,
  secondsUntilUnlock,
} from '../../../utils/exitDelay';
import { formatDelayDuration } from '../../../utils/exitDelay';

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

/**
 * Time left on a hold, as a whole-unit countdown. An exit past its unlock time
 * reads as ready rather than as "0 seconds", which would look like a stuck row.
 */
export const getTimeToRelease = (unlockAt: number, now: number): string => {
  const remaining = secondsUntilUnlock(unlockAt, now);
  if (remaining === 0) {
    return t(translations.perimeterPage.readyNow);
  }
  const { value, unit } = formatDelayDuration(remaining);
  return t(translations.exitDelay.duration[unit], { count: value });
};

/** Shorten an address for a table cell without hiding which address it is. */
export const shortenAddress = (address: string): string =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;
