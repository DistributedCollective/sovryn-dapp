import { renderHook, waitFor } from '@testing-library/react';

import { getExitDelayDisplay } from '../../utils/exitDelay';
import { SURFACE_ZERO_WITHDRAW_COLL } from '../../utils/exitFee';
import { useZeroExitDelayQuote } from './useZeroExitDelayQuote';

/**
 * Zero resolves the perimeter through its OWN pointers on BorrowerOperations,
 * not the lending protocol's, and the two are independently settable. These
 * tests pin that route, and pin that Zero — which ships no queue leg today —
 * announces no hold however large a global delay the controller would quote.
 */

const ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const BORROWER_OPERATIONS = '0x5B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39';
const QUEUE = '0x1111111111111111111111111111111111111111';
const CONTROLLER = '0x99994b4522483DE17F31a5bC010c5901AdD3440E';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const mockZeroContract = jest.fn();
const mockQueuePointer = jest.fn();
const mockControllerPointer = jest.fn();
const mockQuote = jest.fn();

const callRevert = () =>
  Object.assign(new Error('call revert exception'), {
    code: 'CALL_EXCEPTION',
  });

const networkError = () =>
  Object.assign(new Error('missing response'), { code: 'SERVER_ERROR' });

jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    Contract: function (_address: string, abi: string[]) {
      const source = JSON.stringify(abi);
      if (source.includes('exitDelayQueue')) {
        return { exitDelayQueue: () => mockQueuePointer() };
      }
      if (source.includes('exitFeeController')) {
        return { exitFeeController: () => mockControllerPointer() };
      }
      return {
        quoteExitDelayFor: (...args: unknown[]) => mockQuote(...args),
      };
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
  useAccount: () => ({ account: ACCOUNT }),
}));

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

describe('useZeroExitDelayQuote', () => {
  beforeEach(() => {
    mockZeroContract.mockResolvedValue({ address: BORROWER_OPERATIONS });
    mockQueuePointer.mockResolvedValue(QUEUE);
    mockControllerPointer.mockResolvedValue(CONTROLLER);
  });

  it("quotes Zero's own surface through Zero's own pointers", async () => {
    mockQuote.mockResolvedValue({ d: 3600 });

    const { result } = renderHook(() => useZeroExitDelayQuote());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockZeroContract).toHaveBeenCalledWith(
      'borrowerOperations',
      '0x1e',
    );
    expect(mockQuote).toHaveBeenCalledWith(
      ACCOUNT,
      ACCOUNT,
      ACCOUNT,
      SURFACE_ZERO_WITHDRAW_COLL,
      ZERO_ADDRESS,
    );
    expect(result.current.delaySeconds).toBe(3600);
    expect(getExitDelayDisplay(result.current)).toBe('held');
  });

  it('announces no hold while Zero has no queue leg, whatever the controller quotes', async () => {
    // Zero ships no `exitDelayQueue`, so the pointer read reverts. The global
    // delay the controller would return applies to surfaces that queue; a Zero
    // collateral withdrawal is paid at signing and must be shown as such.
    mockQueuePointer.mockRejectedValue(callRevert());
    mockQuote.mockResolvedValue({ d: 172800 });

    const { result } = renderHook(() => useZeroExitDelayQuote());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(false);
    expect(getExitDelayDisplay(result.current)).toBe('none');
    expect(mockQuote).not.toHaveBeenCalled();
  });

  it('reports unknown, never zero, when the quote cannot be read', async () => {
    mockQuote.mockRejectedValue(networkError());

    const { result } = renderHook(() => useZeroExitDelayQuote());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(true);
    expect(getExitDelayDisplay(result.current)).toBe('unknown');
  });

  it('reports unknown when BorrowerOperations cannot be resolved', async () => {
    mockZeroContract.mockRejectedValue(new Error('no artifact'));

    const { result } = renderHook(() => useZeroExitDelayQuote());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(true);
  });
});
