import { act, renderHook } from '@testing-library/react';

import 'jest-canvas-mock';

import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { i18n } from '../../../../../../locales/i18n';
import { useWithdrawCollateral } from './useWithdrawCollateral';

/**
 * A fixed-interest loan's collateral withdrawal is one of the four surfaces
 * the Perimeter withdrawal delay hooks into; resolveGasLimit only applies
 * its 30% margin on top of whatever floor a request configures, so this
 * floor must itself already cover the delay-armed cost — see
 * GAS_LIMIT.WITHDRAW_LOAN_COLLATERAL.
 */

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const mockSetTransactions = jest.fn();
const mockSetIsOpen = jest.fn();
const mockSetTitle = jest.fn();
// ethers only accepts a real Signer here; this is the smallest object that
// satisfies `Signer.isSigner` without reaching a network.
const mockSigner = { _isSigner: true, provider: {} };

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

jest.mock('../../../../../../hooks/useLoadContract', () => ({
  useLoadContract: () => ({
    address: '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7',
    estimateGas: { withdrawCollateral: jest.fn() },
  }),
}));

jest.mock('../../../../../../hooks/useAccount', () => ({
  useAccount: () => ({ account: ACCOUNT, signer: mockSigner }),
}));

jest.mock('../../../../../../contexts/TransactionContext', () => ({
  useTransactionContext: () => ({
    setTransactions: (...args: unknown[]) => mockSetTransactions(...args),
    setIsOpen: (...args: unknown[]) => mockSetIsOpen(...args),
    setTitle: (...args: unknown[]) => mockSetTitle(...args),
  }),
}));

describe('useWithdrawCollateral', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('configures a gas-limit floor sized to the delay-armed call', async () => {
    const { result } = renderHook(() => useWithdrawCollateral());

    await act(async () => {
      await result.current('0.1', '0xloan', jest.fn());
    });

    const step = mockSetTransactions.mock.calls[0][0][0];
    expect(step.request.fnName).toBe('withdrawCollateral');
    // With the floor too low, resolveGasLimit's own margin never rescues a
    // failed estimate — a failed live read falls straight back to this
    // constant outright. It must already cover the delay-armed cost on its
    // own, not rely on the margin ever landing.
    expect(step.request.gasLimit).toBe(GAS_LIMIT.WITHDRAW_LOAN_COLLATERAL);
  });
});
