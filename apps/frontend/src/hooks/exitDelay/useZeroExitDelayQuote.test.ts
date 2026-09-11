import { renderHook, waitFor } from '@testing-library/react';

import { getExitDelayDisplay } from '../../utils/exitDelay';
import { SURFACE_ZERO_WITHDRAW_COLL } from '../../utils/exitFee';
import { useZeroExitDelayQuote } from './useZeroExitDelayQuote';

/**
 * Zero keeps its own pointers on BorrowerOperations, independently settable
 * from the lending protocol's, so its withdrawals are quoted through Zero. How
 * the chain's answers are classified is pinned in quoteExitDelay.test.ts; this
 * file runs the hook on the real shared cache and pins the route.
 */

const BORROWER_OPERATIONS = '0x5B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

let mockAccount = '';

const mockZeroContract = jest.fn();
const mockQuoteExitDelay = jest.fn();

jest.mock('./quoteExitDelay', () => ({
  quoteExitDelay: (...args: unknown[]) => mockQuoteExitDelay(...args),
}));

jest.mock('@sovryn/contracts', () => ({
  ...jest.requireActual('@sovryn/contracts'),
  getZeroContract: (...args: unknown[]) => mockZeroContract(...args),
}));

jest.mock('@sovryn/ethers-provider', () => ({
  ...jest.requireActual('@sovryn/ethers-provider'),
  getProvider: () => ({ getBlockNumber: () => Promise.resolve(100) }),
}));

jest.mock('../../utils/chain', () => ({
  getRskChainId: () => '0x1e',
}));

jest.mock('../useAccount', () => ({
  useAccount: () => ({ account: mockAccount }),
}));

// The shared cache is module-global: each test quotes for its own account.
let nextAccount = 1;
const freshAccount = () =>
  `0x${(nextAccount++).toString(16).padStart(40, '0')}`;

describe('useZeroExitDelayQuote', () => {
  beforeEach(() => {
    mockAccount = freshAccount();
    mockZeroContract.mockResolvedValue({ address: BORROWER_OPERATIONS });
  });

  it("quotes Zero's collateral surface through Zero's own pointers", async () => {
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
      account: mockAccount,
      surfaceId: SURFACE_ZERO_WITHDRAW_COLL,
      subProduct: ZERO_ADDRESS,
    });
    expect(getExitDelayDisplay(result.current)).toBe('held');
  });

  it('reports checking until BorrowerOperations has been resolved', async () => {
    mockZeroContract.mockReturnValue(new Promise(() => undefined));

    const { result } = renderHook(() => useZeroExitDelayQuote());
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(getExitDelayDisplay(result.current)).toBe('checking');
    expect(mockQuoteExitDelay).not.toHaveBeenCalled();
  });

  it('reports unknown when BorrowerOperations cannot be resolved', async () => {
    mockZeroContract.mockRejectedValue(new Error('no artifact'));

    const { result } = renderHook(() => useZeroExitDelayQuote());

    await waitFor(() => expect(result.current.unknown).toBe(true));
    expect(result.current.loading).toBe(false);
    expect(mockQuoteExitDelay).not.toHaveBeenCalled();
  });
});
