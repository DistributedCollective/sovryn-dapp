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
    const { result } = renderHook(() => useExecuteExit(QUEUE));

    await act(async () => {
      await result.current('7', onComplete);
    });

    expect(step().request.fnName).toBe('executeExit');
    expect(step().request.args).toEqual(['7']);
    // Not `expect.any(Function)`: the exact callback must survive, since it is
    // the one that knows which id was just released.
    expect(step().onComplete).toBe(onComplete);
  });

  it('opens the transaction dialog for the release', async () => {
    const { result } = renderHook(() => useExecuteExit(QUEUE));

    await act(async () => {
      await result.current('7');
    });

    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('does nothing without a queue address', async () => {
    const { result } = renderHook(() => useExecuteExit(undefined));

    await act(async () => {
      await result.current('7', jest.fn());
    });

    expect(mockSetTransactions).not.toHaveBeenCalled();
  });
});

describe('useExecuteExits', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('attaches the caller-supplied callback to the batch transaction', async () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() => useExecuteExits(QUEUE));

    await act(async () => {
      await result.current(['7', '8'], onComplete);
    });

    expect(step().request.fnName).toBe('executeExits');
    expect(step().request.args).toEqual([['7', '8']]);
    expect(step().onComplete).toBe(onComplete);
  });

  it('does nothing for an empty batch', async () => {
    const { result } = renderHook(() => useExecuteExits(QUEUE));

    await act(async () => {
      await result.current([], jest.fn());
    });

    expect(mockSetTransactions).not.toHaveBeenCalled();
  });
});
