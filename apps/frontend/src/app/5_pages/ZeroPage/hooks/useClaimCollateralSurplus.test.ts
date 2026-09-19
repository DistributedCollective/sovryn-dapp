import { act, renderHook } from '@testing-library/react';

import 'jest-canvas-mock';

import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { i18n } from '../../../../locales/i18n';
import { SURFACE_ZERO_CLAIM_SURPLUS } from '../../../../utils/exitFee';
import { useClaimCollateralSurplus } from './useClaimCollateralSurplus';

/**
 * A held claim does not arrive in the wallet, so a flow that reports only
 * success reads as money missing. The claim's completion refreshes the page
 * and then fires the same post-signature notice as the other Zero exits,
 * built from the claim surface's own delay quote.
 */

const mockSetTransactions = jest.fn();
const mockSetIsOpen = jest.fn();
const mockSetTitle = jest.fn();
const mockAddNotification = jest.fn();
// ethers only accepts a real Signer here; this is the smallest object that
// satisfies `Signer.isSigner` without reaching a network.
const mockSigner = { _isSigner: true, provider: {} };

let mockDelay: { delaySeconds: number; loading: boolean; unknown: boolean };
let mockDelaySurface: string | undefined;

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

jest.mock('@sovryn/contracts', () => ({
  ...jest.requireActual('@sovryn/contracts'),
  getContract: async () => ({
    address: '0x5B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39',
    abi: ['function claimCollateral()'],
  }),
}));

jest.mock('../../../../hooks/useAccount', () => ({
  useAccount: () => ({ signer: mockSigner }),
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
  useZeroExitDelayQuote: (surface: string) => {
    mockDelaySurface = surface;
    return mockDelay;
  },
}));

const claim = async () => {
  const refresh = jest.fn();
  const { result } = renderHook(() => useClaimCollateralSurplus(refresh));
  await act(async () => {
    await result.current();
  });
  const step = mockSetTransactions.mock.calls[0][0][0];
  return { step, refresh };
};

describe('useClaimCollateralSurplus', () => {
  beforeAll(async () => {
    await i18n;
  });

  beforeEach(() => {
    mockDelaySurface = undefined;
  });

  it('quotes the delay for the claim surface', async () => {
    mockDelay = { delaySeconds: 0, loading: false, unknown: false };

    await claim();

    expect(mockDelaySurface).toBe(SURFACE_ZERO_CLAIM_SURPLUS);
  });

  it('configures a gas-limit floor so resolveGasLimit applies its margin', async () => {
    mockDelay = { delaySeconds: 0, loading: false, unknown: false };

    const { step } = await claim();

    // With no floor, resolveGasLimit returns the bare estimate (no 30%
    // margin) and falls back to the flat, unmeasured 6,000,000 default on a
    // failed estimate — see TransactionStepDialog/utils.ts. This surface is
    // hooked into the same withdrawal delay as the other three, so it needs
    // the same protection.
    expect(step.request.gasLimit).toBe(GAS_LIMIT.CLAIM_SURPLUS);
  });

  it('refreshes the page and names the vault once a held claim completes', async () => {
    mockDelay = { delaySeconds: 172800, loading: false, unknown: false };

    const { step, refresh } = await claim();
    expect(step.request.fnName).toBe('claimCollateral');
    step.onComplete('0xhash');

    expect(refresh).toHaveBeenCalled();
    expect(mockAddNotification).toHaveBeenCalledTimes(1);
    expect(mockAddNotification.mock.calls[0][0].title).toBe(
      'Withdrawal delayed by the Sovryn Perimeter',
    );
  });

  it('says the claim may be held when its delay could not be read', async () => {
    mockDelay = { delaySeconds: 0, loading: false, unknown: true };

    const { step } = await claim();
    step.onComplete('0xhash');

    expect(mockAddNotification.mock.calls[0][0].title).toBe(
      'Withdrawal may be delayed by the Sovryn Perimeter',
    );
  });

  it('only refreshes the page when a quote arrived saying nothing is held', async () => {
    mockDelay = { delaySeconds: 0, loading: false, unknown: false };

    const { step, refresh } = await claim();
    step.onComplete('0xhash');

    expect(refresh).toHaveBeenCalled();
    expect(mockAddNotification).not.toHaveBeenCalled();
  });
});
