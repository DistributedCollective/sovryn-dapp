import { renderHook, waitFor } from '@testing-library/react';

import { getExitDelayDisplay } from '../../utils/exitDelay';
import { useExitDelayQuote } from './useExitDelayQuote';

/**
 * How a quote is classified from the chain's answers is pinned in
 * quoteExitDelay.test.ts, against a local node. This file runs the hook on the
 * real shared cache and pins the route: the lending surfaces are quoted through
 * the lending protocol's own pointers, for this account — and a quote asked
 * before the protocol contract has loaded is never kept as the answer.
 */

const PROTOCOL = '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7';
const SURFACE =
  '0xd4896528a9fba849e3d3db442dea05ef8f08c93e00cc760acac34c42a7dacffe';
const SUB_PRODUCT = '0x0000000000000000000000000000000000000123';

let mockAccount = '';
let mockProtocol: { address: string } | undefined;

const mockQuoteExitDelay = jest.fn();

jest.mock('./quoteExitDelay', () => ({
  quoteExitDelay: (...args: unknown[]) => mockQuoteExitDelay(...args),
}));

jest.mock('@sovryn/ethers-provider', () => ({
  ...jest.requireActual('@sovryn/ethers-provider'),
  getProvider: () => ({ getBlockNumber: () => Promise.resolve(100) }),
}));

jest.mock('../../config/chains', () => ({
  RSK_CHAIN_ID: '0x1e',
}));

jest.mock('../useAccount', () => ({
  useAccount: () => ({ account: mockAccount }),
}));

jest.mock('../useGetContract', () => ({
  useGetProtocolContract: () => mockProtocol,
}));

// The shared cache is module-global: each test quotes for its own account.
let nextAccount = 1;
const freshAccount = () =>
  `0x${(nextAccount++).toString(16).padStart(40, '0')}`;

describe('useExitDelayQuote', () => {
  beforeEach(() => {
    mockAccount = freshAccount();
    mockProtocol = { address: PROTOCOL };
  });

  it("quotes through the lending protocol's pointers, for this account", async () => {
    mockQuoteExitDelay.mockResolvedValue({ delaySeconds: 0, unknown: false });

    const { result } = renderHook(() =>
      useExitDelayQuote(SURFACE, SUB_PRODUCT),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockQuoteExitDelay).toHaveBeenCalledWith({
      chainId: '0x1e',
      consumerAddress: PROTOCOL,
      account: mockAccount,
      surfaceId: SURFACE,
      subProduct: SUB_PRODUCT,
    });
    expect(getExitDelayDisplay(result.current)).toBe('none');
  });

  it('reports checking while the protocol contract has not loaded, and the real quote once it has', async () => {
    mockQuoteExitDelay.mockResolvedValue({
      delaySeconds: 172800,
      unknown: false,
    });
    mockProtocol = undefined;

    const { result, rerender } = renderHook(() =>
      useExitDelayQuote(SURFACE, SUB_PRODUCT),
    );
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(getExitDelayDisplay(result.current)).toBe('checking');

    mockProtocol = { address: PROTOCOL };
    rerender();

    await waitFor(() => expect(result.current.delaySeconds).toBe(172800));
    expect(getExitDelayDisplay(result.current)).toBe('held');
  });

  it('reports checking while the product has not loaded', async () => {
    const { result } = renderHook(() => useExitDelayQuote(SURFACE, undefined));
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(getExitDelayDisplay(result.current)).toBe('checking');
    expect(mockQuoteExitDelay).not.toHaveBeenCalled();
  });
});
