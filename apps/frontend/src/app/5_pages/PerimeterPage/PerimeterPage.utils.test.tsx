import { i18n } from '../../../locales/i18n';
import { PendingExitState } from '../../../utils/exitDelay';
import { getTimeToRelease } from './PerimeterPage.utils';

/**
 * The Releases column is read by someone waiting on a hold: whole minutes,
 * rounded up, then hours and days. Seconds never appear, and a hold with less
 * than a minute left says so rather than counting down.
 */

const NOW = 1_800_000_000;

const timeToRelease = (
  remainingSeconds: number,
  state = PendingExitState.Locked,
) => getTimeToRelease(NOW + remainingSeconds, NOW, state);

describe('getTimeToRelease', () => {
  beforeAll(async () => {
    await i18n;
  });

  it.each([
    [180, '3 min'],
    [3_900, '1 h 5 min'],
    [3_600, '1 h'],
    [183_600, '2 d 3 h'],
    [86_400, '1 d'],
    [90_000, '1 d 1 h'],
    [61, '2 min'],
    [60, '1 min'],
    [3_599, '1 h'],
  ])('shows %i seconds left as "%s"', (remaining, expected) => {
    expect(timeToRelease(remaining)).toBe(expected);
  });

  it.each([1, 30, 59])('shows %i seconds left as under a minute', remaining => {
    expect(timeToRelease(remaining)).toBe('< 1 min');
  });

  it('shows "Now" once the unlock time has passed', () => {
    expect(timeToRelease(0)).toBe('Now');
    expect(timeToRelease(-120)).toBe('Now');
  });

  it('shows no release time for a row it could not read', () => {
    expect(timeToRelease(0, PendingExitState.Unreadable)).toBe('-');
  });

  it('never prints seconds', () => {
    for (let remaining = 1; remaining <= 200_000; remaining += 7) {
      expect(timeToRelease(remaining)).not.toMatch(/\d\s?s\b|second/i);
    }
  });
});
