import { renderHook, waitFor } from '@testing-library/react';

import { getExitDelayDisplay } from '../../utils/exitDelay';
import { SURFACE_ZERO_WITHDRAW_COLL } from '../../utils/exitFee';
import { useZeroExitDelayQuote } from './useZeroExitDelayQuote';

/**
 * Zero keeps its own pointers on BorrowerOperations, independently settable
 * from the lending protocol's, so its withdrawals are quoted through Zero. How
 * the chain's answers are classified is pinned in quoteExitDelay.test.ts.
 */

const ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const BORROWER_OPERATIONS = '0x5B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const mockZeroContract = jest.fn();
const mockQuoteExitDelay = jest.fn();

jest.mock('./quoteExitDelay', () => ({
  NO_DELAY: { delaySeconds: 0, unknown: false },
  UNREADABLE: { delaySeconds: 0, unknown: true },
  quoteExitDelay: (...args: unknown[]) => mockQuoteExitDelay(...args),
}));

jest.mock('@sovryn/contracts', () => ({
  getZeroContract: (...args: unknown[]) => mockZeroContract(...args),
}));

jest.mock('../../utils/chain', () => ({
  getRskChainId: () => '0x1e',
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
      // Holds the latest fn without making the mount effect below re-run:
      // fn's identity changes every render, but this mock fetches once.
      const fnRef = React.useRef(fn);
      fnRef.current = fn;
      React.useEffect(() => {
        let alive = true;
        Promise.resolve(fnRef.current()).then((value: unknown) => {
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
  });

  it("quotes Zero's surface through Zero's own pointers", async () => {
    mockQuoteExitDelay.mockResolvedValue({
      delaySeconds: 3600,
      unknown: false,
    });

    const { result } = renderHook(() => useZeroExitDelayQuote());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockZeroContract).toHaveBeenCalledWith('borrowerOperations', '0x1e');
    expect(mockQuoteExitDelay).toHaveBeenCalledWith({
      chainId: '0x1e',
      consumerAddress: BORROWER_OPERATIONS,
      account: ACCOUNT,
      surfaceId: SURFACE_ZERO_WITHDRAW_COLL,
      subProduct: ZERO_ADDRESS,
    });
    expect(result.current.delaySeconds).toBe(3600);
    expect(getExitDelayDisplay(result.current)).toBe('held');
  });

  it('reports a quote that could not be read as unknown', async () => {
    mockQuoteExitDelay.mockResolvedValue({ delaySeconds: 0, unknown: true });

    const { result } = renderHook(() => useZeroExitDelayQuote());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(getExitDelayDisplay(result.current)).toBe('unknown');
  });

  it('reports unknown when BorrowerOperations cannot be resolved', async () => {
    mockZeroContract.mockRejectedValue(new Error('no artifact'));

    const { result } = renderHook(() => useZeroExitDelayQuote());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(true);
    expect(mockQuoteExitDelay).not.toHaveBeenCalled();
  });
});
