import { renderHook, waitFor } from '@testing-library/react';

import { getExitFeeDisplay } from '../../utils/exitFee';
import { useExitFeeRate } from './useExitFeeRate';

/**
 * The fee fails OPEN on chain, so every consumer hides the rows unless a quote
 * arrived saying a fee is charged. The hook still reports which of "no fee"
 * and "not read" happened: a controller getter the protocol does not have is a
 * stated "no fee", and a pointer read that did not complete is unknown.
 */

const ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const PROTOCOL = '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7';
const CONTROLLER = '0x99994b4522483DE17F31a5bC010c5901AdD3440E';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const SURFACE =
  '0xd4896528a9fba849e3d3db442dea05ef8f08c93e00cc760acac34c42a7dacffe';
const SUB_PRODUCT = '0x0000000000000000000000000000000000000123';

const mockReadPointer = jest.fn();
const mockQuoteExitFee = jest.fn();

jest.mock('../exitDelay/readPerimeterPointer', () => ({
  readPerimeterPointer: (...args: unknown[]) => mockReadPointer(...args),
}));

jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    Contract: function () {
      return {
        functions: {
          quoteExitFee: (...args: unknown[]) => mockQuoteExitFee(...args),
        },
      };
    },
  };
});

jest.mock('@sovryn/ethers-provider', () => ({
  getProvider: () => ({}),
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

// Short enough that the deadline test below does not wait ten real seconds.
jest.mock('../exitDelay/useExitDelay', () => ({
  ...jest.requireActual('../exitDelay/useExitDelay'),
  EXIT_DELAY_QUOTE_TIMEOUT_MS: 50,
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
        // Idle at first, as the shared cache is: a result still to come must
        // be reported by the hook under test, not by this stand-in.
        loading: false,
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

const render = () => renderHook(() => useExitFeeRate(SURFACE, SUB_PRODUCT));

describe('useExitFeeRate', () => {
  it("reads the lending protocol's controller pointer and quotes the rate", async () => {
    mockReadPointer.mockResolvedValue({ kind: 'address', address: CONTROLLER });
    mockQuoteExitFee.mockResolvedValue([{ active: true, rateBps: 10 }]);

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockReadPointer).toHaveBeenCalledWith(
      '0x1e',
      PROTOCOL,
      'exitFeeController',
    );
    expect(result.current.active).toBe(true);
    expect(result.current.rateBps).toBe(10);
    expect(result.current.unknown).toBe(false);
  });

  it('reports a stated "no fee" when the protocol has no controller getter', async () => {
    mockReadPointer.mockResolvedValue({ kind: 'absent' });

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.active).toBe(false);
    expect(result.current.unknown).toBe(false);
    expect(mockQuoteExitFee).not.toHaveBeenCalled();
  });

  it('reports a stated "no fee" when no controller is pinned', async () => {
    mockReadPointer.mockResolvedValue({
      kind: 'address',
      address: ZERO_ADDRESS,
    });

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(false);
    expect(mockQuoteExitFee).not.toHaveBeenCalled();
  });

  it('reports unknown when the controller pointer could not be read, and still hides the rows', async () => {
    mockReadPointer.mockResolvedValue({ kind: 'unreadable' });

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(true);
    expect(mockQuoteExitFee).not.toHaveBeenCalled();
    expect(getExitFeeDisplay(result.current, { gt: () => true } as never)).toBe(
      'none',
    );
  });

  it('reports unknown, not still loading, once its deadline passes without an answer', async () => {
    // A stalled node must not hold Confirm forever: past the deadline the rate
    // is reported unreadable, the same as the two Zero fee hooks already do.
    mockReadPointer.mockResolvedValue({ kind: 'address', address: CONTROLLER });
    mockQuoteExitFee.mockReturnValue(new Promise(() => undefined));

    const { result } = render();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(true);
    expect(result.current.active).toBe(false);
  });
});
