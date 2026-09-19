import { act, renderHook } from '@testing-library/react';

import 'jest-canvas-mock';

import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { i18n } from '../../../../locales/i18n';
import { useHandleTrove } from './useHandleTrove';

/**
 * The Zero page submits adjustments and closes through the functions this hook
 * returns. A collateral withdrawal is held by the withdrawal delay when it
 * applies, so its completion must name the vault; an adjust that moves no
 * collateral must not. These tests call the returned functions and run the
 * completion of the transaction each one builds.
 */

const ACCOUNT = '0x1111111111111111111111111111111111111111';

const mockSetTransactions = jest.fn();
const mockSetIsOpen = jest.fn();
const mockSetTitle = jest.fn();
const mockAddNotification = jest.fn();
const mockAdjustTrove = jest.fn();
// ethers only accepts a real Signer here; this is the smallest object that
// satisfies `Signer.isSigner` without reaching a network.
const mockSigner = { _isSigner: true, provider: {} };

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

jest.mock('@sovryn/contracts', () => ({
  ...jest.requireActual('@sovryn/contracts'),
  getContract: async () => ({
    address: '0x5B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39',
    abi: [
      'function adjustTrove(uint256 maxFee, uint256 collWithdrawal, uint256 debtChange, bool isDebtIncrease, address upperHint, address lowerHint)',
      'function closeTrove()',
    ],
  }),
}));

jest.mock('../utils/trove-manager', () => ({
  adjustTrove: (...args: unknown[]) => mockAdjustTrove(...args),
  openTrove: jest.fn(),
}));

const mockGetTrove = jest.fn();

jest.mock('../../../../utils/liquity', () => ({
  loadLiquity: async () => ({ liquity: { getTrove: mockGetTrove } }),
}));

jest.mock('../../../../utils/transactions', () => ({
  getPermitTransferFrom: async () => ({
    permitted: {},
    spender: '',
    nonce: 0,
    deadline: 0,
  }),
  permitHandler: () => (request: unknown) => request,
  prepareApproveTransaction: async () => undefined,
  preparePermit2Transaction: async () => ({
    title: 'permit2',
    request: { type: 'signTypedData' },
  }),
  preparePermitTransaction: jest.fn(),
  UNSIGNED_PERMIT: '0x',
}));

jest.mock('../../../../hooks/useAccount', () => ({
  useAccount: () => ({ account: ACCOUNT, signer: mockSigner, provider: {} }),
}));

jest.mock('../../../../contexts/TransactionContext', () => ({
  useTransactionContext: () => ({
    setTransactions: (...args: unknown[]) => mockSetTransactions(...args),
    setIsOpen: (...args: unknown[]) => mockSetIsOpen(...args),
    setTitle: (...args: unknown[]) => mockSetTitle(...args),
  }),
}));

jest.mock('../../../../contexts/NotificationContext', () => ({
  useNotificationContext: () => ({ addNotification: mockAddNotification }),
}));

jest.mock('../../../../hooks/exitDelay/useZeroExitDelayQuote', () => ({
  useZeroExitDelayQuote: () => ({
    delaySeconds: 172800,
    loading: false,
    unknown: false,
  }),
}));

const submitValue = (overrides: Record<string, string> = {}) =>
  ({
    token: 'zusd',
    borrow: '',
    repay: '',
    depositCollateral: '',
    withdrawCollateral: '',
    maxOriginationFeeRate: '5',
    ...overrides,
  } as never);

/** The last transaction the hook handed to the dialog. */
const lastStep = () => {
  const steps = mockSetTransactions.mock.calls[0][0];
  return steps[steps.length - 1];
};

describe('useHandleTrove', () => {
  beforeAll(async () => {
    await i18n;
  });

  beforeEach(() => {
    mockAdjustTrove.mockResolvedValue({
      fn: 'adjustTrove',
      args: ['0', '0', '0', false, ACCOUNT, ACCOUNT],
      value: '0',
    });
    mockGetTrove.mockResolvedValue({ netDebt: { toString: () => '100' } });
  });

  it('names the vault once a collateral withdrawal through Adjust completes', async () => {
    const onTroveAdjusted = jest.fn();
    const { result } = renderHook(() =>
      useHandleTrove(true, { onTroveAdjusted }),
    );

    await act(async () => {
      await result.current.handleTroveSubmit(
        submitValue({ withdrawCollateral: '0.1' }),
      );
    });
    lastStep().onComplete('0xhash');

    expect(onTroveAdjusted).toHaveBeenCalled();
    expect(mockAddNotification).toHaveBeenCalledTimes(1);
    expect(mockAddNotification.mock.calls[0][0].title).toBe(
      'Withdrawal delayed by the Sovryn Perimeter',
    );
  });

  it('stays silent after an adjust that moves no collateral', async () => {
    // A collateral field typed into and cleared leaves a truthy '0.0'.
    const onTroveAdjusted = jest.fn();
    const { result } = renderHook(() =>
      useHandleTrove(true, { onTroveAdjusted }),
    );

    await act(async () => {
      await result.current.handleTroveSubmit(
        submitValue({ repay: '10', withdrawCollateral: '0.0' }),
      );
    });
    lastStep().onComplete('0xhash');

    expect(onTroveAdjusted).toHaveBeenCalled();
    expect(mockAddNotification).not.toHaveBeenCalled();
  });

  it('names the vault once a close completes', async () => {
    const onTroveClosed = jest.fn();
    const { result } = renderHook(() =>
      useHandleTrove(true, { onTroveClosed }),
    );

    await act(async () => {
      await result.current.handleTroveClose('zusd');
    });
    lastStep().onComplete('0xhash');

    expect(onTroveClosed).toHaveBeenCalled();
    expect(mockAddNotification).toHaveBeenCalledTimes(1);
  });

  it('configures a gas-limit floor for closing a ZUSD credit line', async () => {
    const { result } = renderHook(() => useHandleTrove(true));

    await act(async () => {
      await result.current.handleTroveClose('zusd');
    });

    expect(lastStep().request.fnName).toBe('closeTrove');
    expect(lastStep().request.gasLimit).toBe(GAS_LIMIT.CLOSE_TROVE);
  });

  it('configures a gas-limit floor for closing a DLLR credit line', async () => {
    const { result } = renderHook(() => useHandleTrove(true));

    await act(async () => {
      await result.current.handleTroveClose('dllr');
    });

    expect(lastStep().request.fnName).toBe('closeNueTroveWithPermit2');
    expect(lastStep().request.gasLimit).toBe(GAS_LIMIT.CLOSE_DLLR_TROVE);
  });
});
