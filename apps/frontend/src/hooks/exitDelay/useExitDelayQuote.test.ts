import { renderHook, waitFor } from '@testing-library/react';

import { getExitDelayDisplay } from '../../utils/exitDelay';
import { useExitDelayQuote } from './useExitDelayQuote';

/**
 * How a quote is classified from the chain's answers is pinned in
 * quoteExitDelay.test.ts, against a local node. This file pins the route: the
 * lending surfaces are quoted through the lending protocol's own pointers, for
 * this account, and the classification reaches the form unchanged.
 */

const ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const PROTOCOL = '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7';
const SURFACE =
  '0xd4896528a9fba849e3d3db442dea05ef8f08c93e00cc760acac34c42a7dacffe';
const SUB_PRODUCT = '0x0000000000000000000000000000000000000123';

const mockQuoteExitDelay = jest.fn();

jest.mock('./quoteExitDelay', () => ({
  NO_DELAY: { delaySeconds: 0, unknown: false },
  quoteExitDelay: (...args: unknown[]) => mockQuoteExitDelay(...args),
}));

jest.mock('../../config/chains', () => ({
  RSK_CHAIN_ID: '0x1e',
}));

jest.mock('../useAccount', () => ({
  useAccount: () => ({ account: ACCOUNT }),
}));

jest.mock('../useGetContract', () => ({
  useGetProtocolContract: () => ({ address: PROTOCOL }),
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

const render = () => renderHook(() => useExitDelayQuote(SURFACE, SUB_PRODUCT));

describe('useExitDelayQuote', () => {
  it("quotes through the lending protocol's pointers, for this account", async () => {
    mockQuoteExitDelay.mockResolvedValue({ delaySeconds: 0, unknown: false });

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockQuoteExitDelay).toHaveBeenCalledWith({
      chainId: '0x1e',
      consumerAddress: PROTOCOL,
      account: ACCOUNT,
      surfaceId: SURFACE,
      subProduct: SUB_PRODUCT,
    });
  });

  it('reports the hold the chain quoted', async () => {
    mockQuoteExitDelay.mockResolvedValue({
      delaySeconds: 172800,
      unknown: false,
    });

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.delaySeconds).toBe(172800);
    expect(getExitDelayDisplay(result.current)).toBe('held');
  });

  it('reports a quote that could not be read as unknown', async () => {
    mockQuoteExitDelay.mockResolvedValue({ delaySeconds: 0, unknown: true });

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(true);
    expect(getExitDelayDisplay(result.current)).toBe('unknown');
  });
});
