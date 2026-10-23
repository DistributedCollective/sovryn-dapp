import { firstValueFrom } from 'rxjs';

import { observeCall, startCall } from './provider-cache';

/**
 * Two reads on the same id can overlap: a new block starts a second read
 * before the first one has finished. Whichever settles last must not be
 * allowed to overwrite whichever answer is actually current.
 */

describe('provider-cache', () => {
  it('keeps the newer read’s value when an older, slower read finishes after it', async () => {
    const id = `test:${Math.random()}`;
    let resolveOlder: (value: string) => void;
    let resolveNewer: (value: string) => void;
    const older = new Promise<string>(resolve => {
      resolveOlder = resolve;
    });
    const newer = new Promise<string>(resolve => {
      resolveNewer = resolve;
    });

    startCall(id, () => older, { blockNumber: 1 });
    startCall(id, () => newer, { blockNumber: 2 });

    resolveNewer!('newer');
    await newer;
    resolveOlder!('older');
    await older;

    const state = await firstValueFrom(observeCall(id));
    expect(state.result.value).toBe('newer');
  });

  it('keeps the newer read’s failure when an older read fails after it', async () => {
    const id = `test:${Math.random()}`;
    let rejectOlder: (error: Error) => void;
    let rejectNewer: (error: Error) => void;
    const older = new Promise<string>((_resolve, reject) => {
      rejectOlder = reject;
    });
    const newer = new Promise<string>((_resolve, reject) => {
      rejectNewer = reject;
    });

    startCall(id, () => older, { blockNumber: 1 });
    startCall(id, () => newer, { blockNumber: 2 });

    rejectNewer!(new Error('newer failed'));
    await newer.catch(() => undefined);
    rejectOlder!(new Error('older failed'));
    await older.catch(() => undefined);

    const state = await firstValueFrom(observeCall(id));
    expect(state.result.error?.message).toBe('newer failed');
  });
});
