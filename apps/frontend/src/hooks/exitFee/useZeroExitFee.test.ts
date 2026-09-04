import { renderHook, waitFor } from '@testing-library/react';

import { BigNumber } from 'ethers';

import { Decimal } from '@sovryn/utils';

import { getExitFeeDisplay } from '../../utils/exitFee';
import { useZeroExitFee } from './useZeroExitFee';

/**
 * The preview FAILS OPEN, and so does the live charge: when the contract cannot
 * obtain a usable quote it returns normally with `active: false`, a zero fee
 * and the reason — and at execution the same path charges nothing and pays the
 * gross. So for every reason the contract can report, the truthful display is
 * the same: no fee taken, no fee shown, the form as it was before the
 * perimeter existed.
 *
 * These tests drive the hook with SUCCESSFUL calls carrying each reason, which
 * is the shape the contract actually produces; a throwing mock exercises the
 * other, already-covered path and proves nothing about this one.
 */

const REASON = {
  NONE: 0,
  INACTIVE: 1,
  DISABLED: 2,
  INVALID_QUOTE: 3,
  CONTROLLER_REVERT: 4,
  VAULT_REVERT: 5,
};

const CONTROLLER = '0x99994b4522483DE17F31a5bC010c5901AdD3440E';
const BORROWER_OPERATIONS = '0x5B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39';

const mockPreview = jest.fn();
const mockControllerPointer = jest.fn();
const mockZeroContract = jest.fn();

// create-react-app's jest preset sets `resetMocks: true`, which strips the
// implementation off every mock before each test. So the module factories below
// must be plain functions that DELEGATE to jest.fn()s wired up in beforeEach —
// an implementation attached here would be gone by the time a test runs, and
// the hook would fall into its catch on every case.
jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    Contract: function (_address: string, abi: unknown) {
      return JSON.stringify(abi).includes('previewZeroCollWithdrawExitFee')
        ? {
            previewZeroCollWithdrawExitFee: (...args: unknown[]) =>
              mockPreview(...args),
          }
        : { exitFeeController: () => mockControllerPointer() };
    },
  };
});

jest.mock('@sovryn/contracts', () => ({
  getZeroContract: (...args: unknown[]) => mockZeroContract(...args),
}));

jest.mock('@sovryn/ethers-provider', () => ({
  getProvider: () => ({}),
}));

jest.mock('../../utils/chain', () => ({
  getRskChainId: () => '0x1e',
}));

jest.mock('../../store/rxjs/provider-cache', () => ({
  asyncCall: (_key: string, fn: () => unknown) => fn(),
}));

jest.mock('../useAccount', () => ({
  useAccount: () => ({ account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' }),
}));

// Stand-in for the shared cache: runs the fetcher once and reports the result,
// so these tests measure the hook's own classification and nothing else.
jest.mock('../useCacheCall', () => {
  const React = jest.requireActual('react');
  return {
    useCacheCall: (
      _key: string,
      _chainId: string,
      fn: () => Promise<unknown>,
      _deps: unknown[],
      defaultValue: unknown,
    ) => {
      const [state, setState] = React.useState({
        value: defaultValue,
        loading: true,
      });
      React.useEffect(() => {
        let alive = true;
        Promise.resolve(fn()).then((value: unknown) => {
          if (alive) setState({ value, loading: false });
        });
        return () => {
          alive = false;
        };
      }, []);
      return state;
    },
  };
});

/** A preview return in the contract's own shape. */
const previewResult = (
  reason: number,
  { active = false, rateBps = 0, feeAmount = '0', netAmount = '0' } = {},
) => ({
  rateBps,
  feeAmount: BigNumber.from(feeAmount),
  netAmount: BigNumber.from(netAmount),
  feeReceiver: '0xDDE75f75ff33Aa802f2316cCAe2bE77823fc6f9B',
  active,
  reason,
});

describe('useZeroExitFee', () => {
  beforeEach(() => {
    mockZeroContract.mockResolvedValue({ address: BORROWER_OPERATIONS });
    mockControllerPointer.mockResolvedValue(CONTROLLER);
  });

  it('reports a live charge when the quote resolves', async () => {
    mockPreview.mockResolvedValue(
      previewResult(REASON.NONE, {
        active: true,
        rateBps: 10,
        feeAmount: '1000000000000000',
        netAmount: '999000000000000000',
      }),
    );

    const { result } = renderHook(() => useZeroExitFee(Decimal.from(1)));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.active).toBe(true);
    expect(result.current.rateBps).toBe(10);
    expect(result.current.unknown).toBe(false);
  });

  it.each([
    ['charging is switched off globally', REASON.INACTIVE],
    ['the surface carries no policy', REASON.DISABLED],
    ['the quote came back unusable', REASON.INVALID_QUOTE],
    ['the controller could not be reached', REASON.CONTROLLER_REVERT],
    ['the vault leg reported a failure', REASON.VAULT_REVERT],
  ])(
    'shows no fee when %s — the chain charges none',
    async (_label, reason) => {
      // The call SUCCEEDS and hands back net == gross: that is the contract
      // saying the user receives the whole amount. The rows must stay hidden.
      mockPreview.mockResolvedValue(
        previewResult(reason, { netAmount: '1000000000000000000' }),
      );

      const { result } = renderHook(() => useZeroExitFee(Decimal.from(1)));

      await waitFor(() => expect(result.current.loading).toBe(false));
      // A throw anywhere upstream also yields active=false, so prove we got
      // here by classifying a successful preview rather than by failing early.
      expect(mockPreview).toHaveBeenCalled();
      expect(result.current.active).toBe(false);
      expect(result.current.unknown).toBe(false);
      expect(getExitFeeDisplay(result.current, result.current.feeAmount)).toBe(
        'none',
      );
    },
  );

  it('shows no fee while the quote has not arrived', async () => {
    mockPreview.mockReturnValue(new Promise(() => undefined)); // never settles

    const { result } = renderHook(() => useZeroExitFee(Decimal.from(1)));

    expect(result.current.loading).toBe(true);
    expect(getExitFeeDisplay(result.current, result.current.feeAmount)).toBe(
      'none',
    );
  });
});
