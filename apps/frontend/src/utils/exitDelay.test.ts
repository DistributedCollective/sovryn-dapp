import {
  BlockState,
  ExitStatus,
  PendingExitState,
  canExecuteExit,
  exitKey,
  formatDelayCountdown,
  formatDelayDuration,
  getExitDelayDisplay,
  getPendingExitState,
  isExecutor,
  secondsUntilUnlock,
} from './exitDelay';

const ORIGINATOR = '0x1111111111111111111111111111111111111111';
const OWNER = '0x2222222222222222222222222222222222222222';
const RECEIVER = '0x3333333333333333333333333333333333333333';
const STRANGER = '0x4444444444444444444444444444444444444444';

const NOW = 1_800_000_000;

const queued = (unlockAt: number) => ({
  status: ExitStatus.Queued,
  unlockAt,
  originator: ORIGINATOR,
  owner: OWNER,
});

describe('exitDelay utils', () => {
  it('shows the hold only when the chain said there is one', () => {
    expect(
      getExitDelayDisplay({ delaySeconds: 0, loading: false, unknown: false }),
    ).toBe('none');
    expect(
      getExitDelayDisplay({ delaySeconds: 1, loading: false, unknown: false }),
    ).toBe('held');
  });

  it('says so when the hold could not be read, instead of saying there is none', () => {
    // The delay fails CLOSED on chain: an unread quote means the withdrawal is
    // held or it reverts. Reporting it as zero would be a false statement.
    expect(
      getExitDelayDisplay({ delaySeconds: 0, loading: false, unknown: true }),
    ).toBe('unknown');
  });

  it('reports a quote still in flight as checking, never as no hold', () => {
    // The delay fails CLOSED on chain, so a quote that has not arrived says
    // nothing about whether the money is paid now.
    expect(
      getExitDelayDisplay({ delaySeconds: 0, loading: true, unknown: false }),
    ).toBe('checking');
    expect(
      getExitDelayDisplay({ delaySeconds: 0, loading: true, unknown: true }),
    ).toBe('checking');
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

  it('counts down in two units without ever understating the wait', () => {
    // The form rounds a policy duration up to one unit, which never promises
    // money sooner than it arrives. On the screen where someone is watching a
    // clock, 25 hours left reading as "2 days" is uselessly coarse.
    expect(formatDelayCountdown(90_000)).toEqual([
      { value: 1, unit: 'days' },
      { value: 1, unit: 'hours' },
    ]);
    expect(formatDelayCountdown(172_801)).toEqual([
      { value: 2, unit: 'days' },
      { value: 1, unit: 'hours' },
    ]);
    expect(formatDelayCountdown(3_599)).toEqual([
      { value: 59, unit: 'minutes' },
      { value: 59, unit: 'seconds' },
    ]);
    expect(formatDelayCountdown(86_400)).toEqual([{ value: 1, unit: 'days' }]);
    expect(formatDelayCountdown(45)).toEqual([{ value: 45, unit: 'seconds' }]);
    expect(formatDelayCountdown(0)).toEqual([]);
  });

  it('rolls a carrying remainder into the unit above it', () => {
    // 1h 59m 59s must not print as "1h 60m".
    expect(formatDelayCountdown(7_199)).toEqual([{ value: 2, unit: 'hours' }]);
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

  it('keys an exit by its queue and id, so equal ids in two queues stay apart', () => {
    expect(exitKey({ queueAddress: '0xAbC', id: '7' })).toBe('0xabc:7');
    expect(exitKey({ queueAddress: '0xabc', id: '7' })).not.toBe(
      exitKey({ queueAddress: '0xdef', id: '7' }),
    );
  });

  describe('pending exit state', () => {
    // The countdown ticks on the page's clock; readiness waits for the latest
    // block, because the queue compares that block's timestamp.
    const at = (now: number, blockTime = now) => ({ now, blockTime });

    it('is locked before the unlock time', () => {
      expect(
        getPendingExitState(queued(NOW + 60), false, OWNER, at(NOW)),
      ).toEqual(PendingExitState.Locked);
    });

    it('is unlocked for an executor once the latest block reaches the unlock time', () => {
      expect(getPendingExitState(queued(NOW), false, OWNER, at(NOW))).toEqual(
        PendingExitState.Unlocked,
      );
    });

    it('is unlocking, not ready, while the countdown has ended but the latest block is still before the unlock time', () => {
      // The latest block trails wall time, by up to about a minute on RSK
      // mainnet, and the queue refuses a release until a block reaches the
      // unlock time.
      expect(
        getPendingExitState(queued(NOW - 1), false, OWNER, at(NOW, NOW - 30)),
      ).toEqual(PendingExitState.Unlocking);
      expect(
        getPendingExitState(queued(NOW - 30), false, OWNER, at(NOW, NOW - 30)),
      ).toEqual(PendingExitState.Unlocked);
    });

    it('tells a non-executor it cannot execute, rather than offering a reverting button', () => {
      expect(
        getPendingExitState(queued(NOW), false, RECEIVER, at(NOW)),
      ).toEqual(PendingExitState.NotExecutor);
      expect(
        getPendingExitState(queued(NOW), false, STRANGER, at(NOW)),
      ).toEqual(PendingExitState.NotExecutor);
    });

    it("shows a frozen party as under investigation once the time has passed; a blacklisted party's row reads Ready", () => {
      const frozen = { ...queued(NOW - 60), blockedState: BlockState.Frozen };
      expect(
        getPendingExitState(frozen, false, OWNER, { now: NOW, blockTime: NOW }),
      ).toBe(PendingExitState.Frozen);
      // Before the time has passed the hold itself is what shows.
      expect(
        getPendingExitState(
          { ...queued(NOW + 60), blockedState: BlockState.Frozen },
          false,
          OWNER,
          { now: NOW, blockTime: NOW },
        ),
      ).toBe(PendingExitState.Locked);
      expect(
        getPendingExitState(
          { ...queued(NOW - 60), blockedState: BlockState.Blacklisted },
          false,
          OWNER,
          { now: NOW, blockTime: NOW },
        ),
      ).toBe(PendingExitState.Unlocked);
      expect(canExecuteExit(PendingExitState.Frozen)).toBe(false);
    });

    it('reads a delivered withdrawal as settled, above every other condition', () => {
      expect(
        getPendingExitState(
          { ...queued(NOW + 60), status: ExitStatus.Executed },
          true,
          OWNER,
          at(NOW),
        ),
      ).toEqual(PendingExitState.Settled);
    });

    it('names the Owner on a withdrawal it resolved, above every other condition', () => {
      expect(
        getPendingExitState(
          { ...queued(NOW + 60), status: ExitStatus.ResolvedByOwner },
          true,
          OWNER,
          at(NOW),
        ),
      ).toEqual(PendingExitState.ResolvedByOwner);
    });

    it('reads a withdrawal returned to the product as such, above every other condition', () => {
      expect(
        getPendingExitState(
          { ...queued(NOW + 60), status: ExitStatus.ResolvedToProtocol },
          true,
          OWNER,
          at(NOW),
        ),
      ).toEqual(PendingExitState.ResolvedToProtocol);
    });

    it('ranks the global pause above the unlock time', () => {
      expect(getPendingExitState(queued(NOW), true, OWNER, at(NOW))).toEqual(
        PendingExitState.Paused,
      );
    });
  });

  it('enables execution for exactly one state', () => {
    expect(canExecuteExit(PendingExitState.Unlocked)).toBe(true);
    for (const state of [
      PendingExitState.Locked,
      PendingExitState.Unlocking,
      PendingExitState.NotExecutor,
      PendingExitState.Paused,
      PendingExitState.Settled,
      PendingExitState.ResolvedByOwner,
      PendingExitState.ResolvedToProtocol,
    ]) {
      expect(canExecuteExit(state)).toBe(false);
    }
  });
});
