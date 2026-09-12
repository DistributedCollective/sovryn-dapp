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
 *
 * The release is checked again inside the send step, immediately before the
 * wallet is asked to sign. What that check returns — the ids that still pass
 * and the gas estimated for exactly those — is what is sent.
 */

const QUEUE = '0x9999999999999999999999999999999999999999';
const OTHER_QUEUE = '0x8888888888888888888888888888888888888888';
const HOLDER = '0x1111111111111111111111111111111111111111';

const mockSetTransactions = jest.fn();
const mockSetIsOpen = jest.fn();
const mockSetTitle = jest.fn();
// ethers only accepts a real Signer here; this is the smallest object that
// satisfies `Signer.isSigner` without reaching a network. Its provider hands
// out a signer bound to one address, as a wallet's provider does.
const mockSigner = {
  _isSigner: true,
  provider: {
    getSigner: (address: string) => ({
      _isSigner: true,
      provider: {},
      getAddress: async () => address,
    }),
  },
};

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

/** A step's config as the dialog prepared it when it opened: its flat gas default. */
const OPENED_CONFIG = { gasLimit: '6000000', gasPrice: '0.065' };

/** Run a step's send check the way the dialog does when the holder confirms. */
const sendStep = (transaction: {
  request: unknown;
  beforeSend: (step: { request: unknown; config: unknown }) => Promise<{
    request: {
      args: unknown[];
      contract: { signer: { getAddress: () => Promise<string> } };
    };
    config: { gasLimit?: string };
  }>;
}) =>
  transaction.beforeSend({
    request: transaction.request,
    config: OPENED_CONFIG,
  });

describe('useExecuteExit', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('attaches the caller-supplied callback to the release transaction', async () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() => useExecuteExit());

    await act(async () => {
      await result.current(QUEUE, '7', { onComplete, preflight: jest.fn() });
    });

    expect(step().title).toBe('Release delayed withdrawal');
    expect(step().request.fnName).toBe('executeExit');
    expect(step().request.args).toEqual(['7']);
    // Not `expect.any(Function)`: the exact callback must survive, since it is
    // the one that knows which id was just released.
    expect(step().onComplete).toBe(onComplete);
  });

  it('opens the transaction dialog for the release', async () => {
    const { result } = renderHook(() => useExecuteExit());

    await act(async () => {
      await result.current(QUEUE, '7', { preflight: jest.fn() });
    });

    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('checks the release again inside the send step, and sends it with the gas that check estimated', async () => {
    const preflight = jest.fn().mockResolvedValue({
      requestIds: ['7'],
      gasLimit: '50000',
      from: HOLDER,
    });
    const { result } = renderHook(() => useExecuteExit());

    await act(async () => {
      await result.current(QUEUE, '7', { preflight });
    });
    const sent = await sendStep(step());

    // The dialog prepared its gas limit itself, so the check is told of no
    // typed limit.
    expect(preflight).toHaveBeenCalledWith(
      { queueAddress: QUEUE, requestIds: ['7'] },
      undefined,
    );
    expect(sent.request.args).toEqual(['7']);
    expect(sent.config).toEqual({ ...OPENED_CONFIG, gasLimit: '50000' });
  });

  it('hands the check inside the send step a gas limit the holder typed in Advanced settings, and sends the limit that check settles on', async () => {
    const preflight = jest.fn().mockResolvedValue({
      requestIds: ['7'],
      gasLimit: '75000',
      from: HOLDER,
    });
    const { result } = renderHook(() => useExecuteExit());

    await act(async () => {
      await result.current(QUEUE, '7', { preflight });
    });
    const sent = await step().beforeSend({
      request: step().request,
      config: {
        ...OPENED_CONFIG,
        gasLimit: '75000',
        gasLimitTypedByUser: true,
      },
    });

    expect(preflight).toHaveBeenCalledWith(
      { queueAddress: QUEUE, requestIds: ['7'] },
      '75000',
    );
    expect(sent.config.gasLimit).toBe('75000');
  });

  it('hands the wallet the release from the account the check ran for, whichever account is active later', async () => {
    const preflight = jest.fn().mockResolvedValue({
      requestIds: ['7'],
      gasLimit: '50000',
      from: HOLDER,
    });
    const { result } = renderHook(() => useExecuteExit());

    await act(async () => {
      await result.current(QUEUE, '7', { preflight });
    });
    const sent = await sendStep(step());

    expect(await sent.request.contract.signer.getAddress()).toBe(HOLDER);
  });

  it('sends nothing when the check inside the send step names no account to send from', async () => {
    const preflight = jest
      .fn()
      .mockResolvedValue({ requestIds: ['7'], gasLimit: '50000', from: '' });
    const { result } = renderHook(() => useExecuteExit());

    await act(async () => {
      await result.current(QUEUE, '7', { preflight });
    });

    await expect(sendStep(step())).rejects.toThrow();
  });

  it('sends nothing when the check inside the send step refuses', async () => {
    const preflight = jest.fn().mockRejectedValue(new Error('refused'));
    const { result } = renderHook(() => useExecuteExit());

    await act(async () => {
      await result.current(QUEUE, '7', { preflight });
    });

    await expect(sendStep(step())).rejects.toThrow();
  });

  it('sends nothing when the check inside the send step does not pass the id', async () => {
    const preflight = jest
      .fn()
      .mockResolvedValue({ requestIds: [], gasLimit: '50000' });
    const { result } = renderHook(() => useExecuteExit());

    await act(async () => {
      await result.current(QUEUE, '7', { preflight });
    });

    await expect(sendStep(step())).rejects.toThrow();
  });

  it('does nothing without a queue address', async () => {
    const { result } = renderHook(() => useExecuteExit());

    await act(async () => {
      await result.current(undefined, '7', {
        onComplete: jest.fn(),
        preflight: jest.fn(),
      });
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
    const preflight = jest.fn().mockResolvedValue({
      requestIds: ['7', '8'],
      gasLimit: '50000',
      from: HOLDER,
    });
    const { result } = renderHook(() => useExecuteExits());

    await act(async () => {
      await result.current([{ queueAddress: QUEUE, requestIds: ['7', '8'] }], {
        onComplete,
        preflight,
      });
    });

    expect(step().request.fnName).toBe('executeExits');
    expect(step().request.args).toEqual([['7', '8']]);
    await sendStep(step());
    step().onComplete();
    expect(onComplete).toHaveBeenCalledWith({
      queueAddress: QUEUE,
      requestIds: ['7', '8'],
    });
  });

  it('sends only the ids the check inside the send step still passes, with the gas estimated for them, and settles exactly those', async () => {
    const onComplete = jest.fn();
    const preflight = jest.fn().mockResolvedValue({
      requestIds: ['7', '9'],
      gasLimit: '50000',
      from: HOLDER,
    });
    const { result } = renderHook(() => useExecuteExits());

    await act(async () => {
      await result.current(
        [{ queueAddress: QUEUE, requestIds: ['7', '8', '9'] }],
        { onComplete, preflight },
      );
    });
    const sent = await sendStep(step());

    expect(preflight).toHaveBeenCalledWith(
      { queueAddress: QUEUE, requestIds: ['7', '8', '9'] },
      undefined,
    );
    expect(sent.request.args).toEqual([['7', '9']]);
    expect(sent.config).toEqual({ ...OPENED_CONFIG, gasLimit: '50000' });
    expect(await sent.request.contract.signer.getAddress()).toBe(HOLDER);
    step().onComplete();
    expect(onComplete).toHaveBeenCalledWith({
      queueAddress: QUEUE,
      requestIds: ['7', '9'],
    });
  });

  it('hands the check inside the send step a gas limit the holder typed in Advanced settings for the batch', async () => {
    const preflight = jest.fn().mockResolvedValue({
      requestIds: ['7', '8'],
      gasLimit: '90000',
      from: HOLDER,
    });
    const { result } = renderHook(() => useExecuteExits());

    await act(async () => {
      await result.current([{ queueAddress: QUEUE, requestIds: ['7', '8'] }], {
        preflight,
      });
    });
    const sent = await step().beforeSend({
      request: step().request,
      config: {
        ...OPENED_CONFIG,
        gasLimit: '90000',
        gasLimitTypedByUser: true,
      },
    });

    expect(preflight).toHaveBeenCalledWith(
      { queueAddress: QUEUE, requestIds: ['7', '8'] },
      '90000',
    );
    expect(sent.config.gasLimit).toBe('90000');
  });

  it('sends no batch when the check inside the send step names no account to send from', async () => {
    const preflight = jest
      .fn()
      .mockResolvedValue({ requestIds: ['7'], gasLimit: '50000', from: '' });
    const { result } = renderHook(() => useExecuteExits());

    await act(async () => {
      await result.current([{ queueAddress: QUEUE, requestIds: ['7', '8'] }], {
        preflight,
      });
    });

    await expect(sendStep(step())).rejects.toThrow();
  });

  it('never sends an empty batch when the check inside the send step passes no id', async () => {
    const preflight = jest
      .fn()
      .mockResolvedValue({ requestIds: [], gasLimit: '50000' });
    const { result } = renderHook(() => useExecuteExits());

    await act(async () => {
      await result.current([{ queueAddress: QUEUE, requestIds: ['7', '8'] }], {
        preflight,
      });
    });

    await expect(sendStep(step())).rejects.toThrow();
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
        { onComplete, preflight: jest.fn() },
      );
    });

    const steps = mockSetTransactions.mock.calls[0][0];
    expect(steps).toHaveLength(1 + 1);
    expect(steps[0].request.contract.address).toBe(QUEUE);
    expect(steps[1].request.contract.address).toBe(OTHER_QUEUE);
    expect(typeof steps[0].beforeSend).toBe('function');
    expect(typeof steps[1].beforeSend).toBe('function');
    steps[1].onComplete();
    expect(onComplete).toHaveBeenCalledWith({
      queueAddress: OTHER_QUEUE,
      requestIds: ['8'],
    });
  });

  it('does nothing for an empty batch', async () => {
    const { result } = renderHook(() => useExecuteExits());

    await act(async () => {
      await result.current([{ queueAddress: QUEUE, requestIds: [] }], {
        onComplete: jest.fn(),
        preflight: jest.fn(),
      });
    });

    expect(mockSetTransactions).not.toHaveBeenCalled();
  });
});
