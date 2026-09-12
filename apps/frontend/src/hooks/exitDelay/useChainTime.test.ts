import { renderHook, waitFor } from '@testing-library/react';

import {
  JsonRpcStub,
  captureCallFailure,
  startJsonRpcStub,
} from '../../utils/testing/jsonRpcStub';
import { useChainTime } from './useChainTime';

/**
 * The queue compares `block.timestamp`. A clock a couple of minutes fast flips
 * a still-locked hold to "Ready", and the release reverts NotUnlocked — inside
 * a batch, taking every other ready hold with it. So this hook must follow the
 * chain and use the local clock only for the seconds elapsed since the block,
 * and it must say when the block could not be read rather than leave callers
 * waiting on a time that will not arrive.
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
        // Idle at first, as the shared cache is: a result still to come must
        // be reported by the hook under test, not by this stand-in.
        loading: false,
        error: null,
      });
      // Hold the latest fn and default without making the mount effect below
      // re-run: their identities change every render, but this mock fetches
      // once.
      const fnRef = React.useRef(fn);
      fnRef.current = fn;
      const defaultRef = React.useRef(defaultValue);
      defaultRef.current = defaultValue;
      React.useEffect(() => {
        let alive = true;
        // Like the shared cache, a failed fetch leaves the default value and
        // reports the error.
        Promise.resolve(fnRef.current()).then(
          (value: unknown) => {
            if (alive) setState({ value, loading: false, error: null });
          },
          (error: unknown) => {
            if (alive) {
              setState({ value: defaultRef.current, loading: false, error });
            }
          },
        );
        return () => {
          alive = false;
        };
      }, []);
      return state;
    },
  };
});

describe('useChainTime', () => {
  let stub: JsonRpcStub;
  let transportFailure: unknown;

  beforeAll(async () => {
    stub = await startJsonRpcStub();
    transportFailure = await captureCallFailure(stub, {
      status: 503,
      body: 'unavailable',
    });
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await stub.close();
  });

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(LOCAL_NOW);
    mockGetBlock.mockResolvedValue({ timestamp: BLOCK_TIMESTAMP });
  });

  it("reads the chain's clock, not the machine's", async () => {
    const { result } = renderHook(() => useChainTime('0x1e' as never));

    await waitFor(() => expect(result.current.now).toBeGreaterThan(0));
    expect(mockGetBlock).toHaveBeenCalledWith('latest');
    expect(result.current.now).toBe(BLOCK_TIMESTAMP);
    expect(result.current.unreadable).toBe(false);
  });

  it('advances by elapsed local time, so a wrong offset cancels out', async () => {
    const { result } = renderHook(() => useChainTime('0x1e' as never));
    await waitFor(() => expect(result.current.now).toBeGreaterThan(0));

    // Ninety seconds pass on a clock that is still an hour off. The hook only
    // re-reads the clock on its one-second tick, so the wait must outlast at
    // least one full tick; waitFor's default of one second races it.
    (Date.now as jest.Mock).mockReturnValue(LOCAL_NOW + 90_000);
    await waitFor(() => expect(result.current.now).toBe(BLOCK_TIMESTAMP + 90), {
      timeout: 2_500,
    });
  });

  it('reports 0, and not unreadable, until a block has been read', () => {
    mockGetBlock.mockReturnValue(new Promise(() => undefined));

    const { result } = renderHook(() => useChainTime('0x1e' as never));

    // Callers treat 0 as "not known yet": deciding a release against it would
    // be deciding against the epoch.
    expect(result.current.now).toBe(0);
    expect(result.current.unreadable).toBe(false);
  });

  it('reports the clock as unreadable when the block read fails', async () => {
    mockGetBlock.mockRejectedValue(transportFailure);

    const { result } = renderHook(() => useChainTime('0x1e' as never));

    await waitFor(() => expect(result.current.unreadable).toBe(true));
    expect(result.current.now).toBe(0);
  });
});
