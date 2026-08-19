import {
  BlockState,
  ExitStatus,
  PendingExitState,
  canExecuteExit,
  formatDelayDuration,
  getPendingExitState,
  isExecutor,
  isExitDelayShown,
  secondsUntilUnlock,
} from './exitDelay';

const ORIGINATOR = '0x1111111111111111111111111111111111111111';
const OWNER = '0x2222222222222222222222222222222222222222';
const RECEIVER = '0x3333333333333333333333333333333333333333';
const STRANGER = '0x4444444444444444444444444444444444444444';

const NOW = 1_800_000_000;

const clear = {
  originator: BlockState.None,
  owner: BlockState.None,
  receiver: BlockState.None,
};

const queued = (unlockAt: number) => ({
  status: ExitStatus.Queued,
  unlockAt,
  originator: ORIGINATOR,
  owner: OWNER,
});

describe('exitDelay utils', () => {
  it('shows a delay only when the perimeter holds funds back', () => {
    expect(isExitDelayShown(0)).toBe(false);
    expect(isExitDelayShown(1)).toBe(true);
  });

  it('formats a duration in whole units, rounding up', () => {
    expect(formatDelayDuration(0)).toEqual({ value: 0, unit: 'seconds' });
    expect(formatDelayDuration(45)).toEqual({ value: 45, unit: 'seconds' });
    expect(formatDelayDuration(60)).toEqual({ value: 1, unit: 'minutes' });
    expect(formatDelayDuration(90)).toEqual({ value: 2, unit: 'minutes' });
    expect(formatDelayDuration(3_600)).toEqual({ value: 1, unit: 'hours' });
    expect(formatDelayDuration(3_601)).toEqual({ value: 2, unit: 'hours' });
    expect(formatDelayDuration(86_400)).toEqual({ value: 1, unit: 'days' });
    expect(formatDelayDuration(172_801)).toEqual({ value: 3, unit: 'days' });
  });

  it('never reports a negative time to unlock', () => {
    expect(secondsUntilUnlock(NOW + 60, NOW)).toEqual(60);
    expect(secondsUntilUnlock(NOW - 60, NOW)).toEqual(0);
  });

  it('treats originator and owner as executors, and the receiver as not one', () => {
    const exit = queued(NOW);
    expect(isExecutor(exit, ORIGINATOR)).toBe(true);
    expect(isExecutor(exit, OWNER)).toBe(true);
    expect(isExecutor(exit, ORIGINATOR.toUpperCase())).toBe(true);
    expect(isExecutor(exit, RECEIVER)).toBe(false);
    expect(isExecutor(exit, undefined)).toBe(false);
  });

  describe('pending exit state', () => {
    it('is locked before the unlock time', () => {
      expect(
        getPendingExitState(queued(NOW + 60), clear, false, OWNER, NOW),
      ).toEqual(PendingExitState.Locked);
    });

    it('is unlocked for an executor once the window passes', () => {
      expect(
        getPendingExitState(queued(NOW), clear, false, OWNER, NOW),
      ).toEqual(PendingExitState.Unlocked);
    });

    it('tells a non-executor it cannot execute, rather than offering a reverting button', () => {
      expect(
        getPendingExitState(queued(NOW), clear, false, RECEIVER, NOW),
      ).toEqual(PendingExitState.NotExecutor);
      expect(
        getPendingExitState(queued(NOW), clear, false, STRANGER, NOW),
      ).toEqual(PendingExitState.NotExecutor);
    });

    it('reports blocked when ANY party is frozen or blacklisted', () => {
      const cases = [
        { ...clear, originator: BlockState.Frozen },
        { ...clear, owner: BlockState.Blacklisted },
        { ...clear, receiver: BlockState.Frozen },
      ];
      for (const blocks of cases) {
        expect(
          getPendingExitState(queued(NOW), blocks, false, OWNER, NOW),
        ).toEqual(PendingExitState.Blocked);
      }
    });

    it('ranks a terminal status above every other condition', () => {
      for (const status of [
        ExitStatus.Executed,
        ExitStatus.ResolvedToProtocol,
        ExitStatus.ResolvedBySIP,
      ]) {
        expect(
          getPendingExitState(
            { ...queued(NOW + 60), status },
            { ...clear, owner: BlockState.Frozen },
            true,
            OWNER,
            NOW,
          ),
        ).toEqual(PendingExitState.Settled);
      }
    });

    it('ranks the global pause above the unlock time', () => {
      expect(getPendingExitState(queued(NOW), clear, true, OWNER, NOW)).toEqual(
        PendingExitState.Paused,
      );
    });

    it('ranks the unlock time above the block gate, matching the contract order', () => {
      expect(
        getPendingExitState(
          queued(NOW + 60),
          { ...clear, owner: BlockState.Frozen },
          false,
          OWNER,
          NOW,
        ),
      ).toEqual(PendingExitState.Locked);
    });
  });

  it('enables execution for exactly one state', () => {
    expect(canExecuteExit(PendingExitState.Unlocked)).toBe(true);
    for (const state of [
      PendingExitState.Locked,
      PendingExitState.NotExecutor,
      PendingExitState.Blocked,
      PendingExitState.Paused,
      PendingExitState.Settled,
    ]) {
      expect(canExecuteExit(state)).toBe(false);
    }
  });
});
