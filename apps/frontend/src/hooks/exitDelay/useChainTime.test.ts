import { renderHook, waitFor } from '@testing-library/react';

import { useChainTime } from './useChainTime';

/**
 * The queue compares `block.timestamp`. A clock a couple of minutes fast flips
 * a still-locked hold to "Ready", and the release reverts NotUnlocked — inside
 * a batch, taking every other ready hold with it. So this hook must follow the
 * chain and use the local clock only for the seconds elapsed since the block.
 */

const BLOCK_TIMESTAMP = 1_800_000_000;
/** The machine is an hour fast. Only the elapsed delta may survive that. */
const LOCAL_NOW = (BLOCK_TIMESTAMP + 3_600) * 1000;

const mockGetBlock = jest.fn();

jest.mock('@sovryn/ethers-provider', () => ({
  getProvider: () => ({ getBlock: (tag: string) => mockGetBlock(tag) }),
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

describe('useChainTime', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(LOCAL_NOW);
    mockGetBlock.mockResolvedValue({ timestamp: BLOCK_TIMESTAMP });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("reads the chain's clock, not the machine's", async () => {
    const { result } = renderHook(() => useChainTime('0x1e' as never));

    await waitFor(() => expect(result.current).toBeGreaterThan(0));
    expect(mockGetBlock).toHaveBeenCalledWith('latest');
    expect(result.current).toBe(BLOCK_TIMESTAMP);
  });

  it('advances by elapsed local time, so a wrong offset cancels out', async () => {
    const { result } = renderHook(() => useChainTime('0x1e' as never));
    await waitFor(() => expect(result.current).toBeGreaterThan(0));

    // Ninety seconds pass on a clock that is still an hour off. The hook only
    // re-reads the clock on its one-second tick, so the wait must outlast at
    // least one full tick; waitFor's default of one second races it.
    (Date.now as jest.Mock).mockReturnValue(LOCAL_NOW + 90_000);
    await waitFor(() => expect(result.current).toBe(BLOCK_TIMESTAMP + 90), {
      timeout: 2_500,
    });
  });

  it('reports 0 until a block has been read', () => {
    mockGetBlock.mockReturnValue(new Promise(() => undefined));

    const { result } = renderHook(() => useChainTime('0x1e' as never));

    // Callers treat 0 as "not known yet": deciding a release against it would
    // be deciding against the epoch.
    expect(result.current).toBe(0);
  });
});
