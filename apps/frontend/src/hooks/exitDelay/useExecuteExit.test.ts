import { act, renderHook } from '@testing-library/react';

import { i18n } from '../../locales/i18n';
import { useExecuteExit, useExecuteExits } from './useExecuteExit';

/**
 * These hooks are mocked away in the page's own tests, so nothing there sees
 * what the real ones do with their arguments — and an `onComplete` the page
 * passed but the hook never accepted sat in the tree unnoticed. That callback
 * is what drops a just-released id, and without it a second release of the
 * same id reverts the whole atomic batch. So it is asserted here, against the
 * real hook, all the way onto the transaction it is attached to.
 */

const QUEUE = '0x9999999999999999999999999999999999999999';
const OTHER_QUEUE = '0x8888888888888888888888888888888888888888';

const mockSetTransactions = jest.fn();
const mockSetIsOpen = jest.fn();
const mockSetTitle = jest.fn();
// ethers only accepts a real Signer here; this is the smallest object that
// satisfies `Signer.isSigner` without reaching a network.
const mockSigner = { _isSigner: true, provider: {} };

jest.mock('../useAccount', () => ({
  useAccount: () => ({ signer: mockSigner }),
}));

jest.mock('../../contexts/TransactionContext', () => ({
  useTransactionContext: () => ({
    setTransactions: (...args: unknown[]) => mockSetTransactions(...args),
    setIsOpen: (...args: unknown[]) => mockSetIsOpen(...args),
    setTitle: (...args: unknown[]) => mockSetTitle(...args),
  }),
}));

const step = () => mockSetTransactions.mock.calls[0][0][0];

describe('useExecuteExit', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('attaches the caller-supplied callback to the release transaction', async () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() => useExecuteExit());

    await act(async () => {
      await result.current(QUEUE, '7', onComplete);
    });

    expect(step().request.fnName).toBe('executeExit');
    expect(step().request.args).toEqual(['7']);
    // Not `expect.any(Function)`: the exact callback must survive, since it is
    // the one that knows which id was just released.
    expect(step().onComplete).toBe(onComplete);
  });

  it('opens the transaction dialog for the release', async () => {
    const { result } = renderHook(() => useExecuteExit());

    await act(async () => {
      await result.current(QUEUE, '7');
    });

    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('does nothing without a queue address', async () => {
    const { result } = renderHook(() => useExecuteExit());

    await act(async () => {
      await result.current(undefined, '7', jest.fn());
    });

    expect(mockSetTransactions).not.toHaveBeenCalled();
  });
});

describe('useExecuteExits', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('reports the batch it settled, queue and ids, so the page can drop exactly those rows', async () => {
    // Ids restart in each queue: an id alone would also drop another queue's
    // request that shares it.
    const onComplete = jest.fn();
    const { result } = renderHook(() => useExecuteExits());

    await act(async () => {
      await result.current(
        [{ queueAddress: QUEUE, requestIds: ['7', '8'] }],
        onComplete,
      );
    });

    expect(step().request.fnName).toBe('executeExits');
    expect(step().request.args).toEqual([['7', '8']]);
    step().onComplete();
    expect(onComplete).toHaveBeenCalledWith({
      queueAddress: QUEUE,
      requestIds: ['7', '8'],
    });
  });

  it('signs one transaction per queue, in a single list', async () => {
    // A second call would replace the first: the holder would sign only the
    // last queue's release while believing they released everything.
    const onComplete = jest.fn();
    const { result } = renderHook(() => useExecuteExits());

    await act(async () => {
      await result.current(
        [
          { queueAddress: QUEUE, requestIds: ['7'] },
          { queueAddress: OTHER_QUEUE, requestIds: ['8'] },
        ],
        onComplete,
      );
    });

    const steps = mockSetTransactions.mock.calls[0][0];
    expect(steps).toHaveLength(1 + 1);
    expect(steps[0].request.contract.address).toBe(QUEUE);
    expect(steps[1].request.contract.address).toBe(OTHER_QUEUE);
    steps[1].onComplete();
    expect(onComplete).toHaveBeenCalledWith({
      queueAddress: OTHER_QUEUE,
      requestIds: ['8'],
    });
  });

  it('does nothing for an empty batch', async () => {
    const { result } = renderHook(() => useExecuteExits());

    await act(async () => {
      await result.current(
        [{ queueAddress: QUEUE, requestIds: [] }],
        jest.fn(),
      );
    });

    expect(mockSetTransactions).not.toHaveBeenCalled();
  });
});
