import { renderHook, waitFor } from '@testing-library/react';

import { BigNumber } from 'ethers';

import { usePerimeterVault } from './usePerimeterVault';

/**
 * The whole read used to be wrapped in one catch returning an empty vault, and
 * the page printed "not holding any withdrawals" for it. An RPC timeout, a
 * rate limit and an honest empty queue are the same value there, and only one
 * of the three is safe to state. These tests drive each of those shapes and
 * hold them apart.
 */

const ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const PROTOCOL = '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7';
const BORROWER_OPERATIONS = '0x5B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39';
// The hook remembers a queue address for the life of the tab, keyed by the
// consumer it came from. The divergence test uses its own BorrowerOperations
// so its queue is not still remembered when the fallback test runs.
const OTHER_BORROWER_OPERATIONS = '0x6B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39';
const QUEUE = '0x1111111111111111111111111111111111111111';
const ZERO_QUEUE = '0x2222222222222222222222222222222222222222';
const RECEIVER = '0x3333333333333333333333333333333333333333';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
/** rUSDT on RSK — 18 decimals, like every asset on these surfaces today. */
const RUSDT = '0xEf213441a85DF4d7acBdAe0Cf78004E1e486BB96';

const mockQueuePointer = jest.fn();
const mockGetActive = jest.fn();
const mockGetRequest = jest.fn();
const mockBlockStateOf = jest.fn();
const mockPaused = jest.fn();
const mockZeroContract = jest.fn();
const mockGetCode = jest.fn();

const networkError = () =>
  Object.assign(new Error('missing response'), { code: 'SERVER_ERROR' });

jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    Contract: function (address: string, abi: string[]) {
      if (JSON.stringify(abi).includes('exitDelayQueue')) {
        return { exitDelayQueue: () => mockQueuePointer(address) };
      }
      return {
        getActive: (...args: unknown[]) => mockGetActive(address, ...args),
        getRequest: (id: string) => mockGetRequest(address, id),
        blockStateOf: (party: string) => mockBlockStateOf(address, party),
        securityPerimeterPaused: () => mockPaused(address),
      };
    },
  };
});

// Only the Zero lookup is stubbed: the asset list this hook reads to resolve
// a token's symbol and decimals is the real one.
jest.mock('@sovryn/contracts', () => ({
  ...jest.requireActual('@sovryn/contracts'),
  getZeroContract: (...args: unknown[]) => mockZeroContract(...args),
}));

// Only the provider is stubbed: the asset lookups this hook does to scale an
// amount go through the real network mapping.
jest.mock('@sovryn/ethers-provider', () => ({
  ...jest.requireActual('@sovryn/ethers-provider'),
  getProvider: () => ({ getCode: mockGetCode }),
}));

jest.mock('../../config/chains', () => ({
  RSK_CHAIN_ID: '0x1e',
}));

jest.mock('../../store/rxjs/provider-cache', () => ({
  asyncCall: (_key: string, fn: () => unknown) => fn(),
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

/** A queued request in the contract's own field order. */
const request = (overrides: Record<string, unknown> = {}) => ({
  amount: BigNumber.from('1500000000000000000'),
  createdAt: BigNumber.from(1_800_000_000),
  unlockAt: BigNumber.from(1_800_086_400),
  originator: ACCOUNT,
  owner: ACCOUNT,
  receiver: RECEIVER,
  token: ZERO_ADDRESS,
  surfaceId: '0x00',
  subProduct: ZERO_ADDRESS,
  status: 1,
  unwrapOnDelivery: false,
  ...overrides,
});

const settled = async () => {
  const hook = renderHook(() => usePerimeterVault());
  await waitFor(() => expect(hook.result.current.loading).toBe(false));
  return hook.result;
};

describe('usePerimeterVault', () => {
  beforeEach(() => {
    mockZeroContract.mockResolvedValue({ address: BORROWER_OPERATIONS });
    mockQueuePointer.mockImplementation(async (address: string) =>
      address === PROTOCOL ? QUEUE : ZERO_ADDRESS,
    );
    mockGetActive.mockResolvedValue({
      ids: [],
      nextCursor: BigNumber.from(0),
    });
    mockPaused.mockResolvedValue(false);
    mockBlockStateOf.mockResolvedValue(0);
    mockGetRequest.mockResolvedValue(request());
    mockGetCode.mockResolvedValue('0x');
  });

  it('reports an empty queue as empty, not as unread', async () => {
    const result = await settled();

    expect(result.current.exits).toHaveLength(0);
    expect(result.current.unknown).toBe(false);
  });

  it('reports unknown when the read fails, never an empty vault', async () => {
    mockGetActive.mockRejectedValue(networkError());

    const result = await settled();

    expect(result.current.unknown).toBe(true);
    expect(result.current.exits).toHaveLength(0);
  });

  it('reports unknown when a queue pointer cannot be reached', async () => {
    mockQueuePointer.mockRejectedValue(networkError());

    const result = await settled();

    expect(result.current.unknown).toBe(true);
  });

  it('treats a reverting queue pointer as an answer, not as an unread', async () => {
    // A consumer that predates the perimeter has no exitDelayQueue and no leg
    // to escrow with, so "nothing held" is the truth for it.
    mockQueuePointer.mockRejectedValue(
      Object.assign(new Error('call revert exception'), {
        code: 'CALL_EXCEPTION',
      }),
    );

    const result = await settled();

    expect(result.current.unknown).toBe(false);
    expect(result.current.exits).toHaveLength(0);
  });

  it('stays loading until the first attempt resolves', () => {
    mockGetActive.mockReturnValue(new Promise(() => undefined));

    const { result } = renderHook(() => usePerimeterVault());

    // The cache seeds its state with the default value and loading false, so
    // the page rendered its "nothing held" message before a single request had
    // been issued.
    expect(result.current.loading).toBe(true);
  });

  it('de-duplicates ids repeated by a best-effort getActive page', async () => {
    // The contract documents getActive as best-effort over a mutating set. A
    // repeated id puts the same id twice into one executeExits call, where the
    // second pass reverts AlreadyTerminal and takes the batch with it.
    mockGetActive.mockResolvedValue({
      ids: [BigNumber.from(7), BigNumber.from(7), BigNumber.from(8)],
      nextCursor: BigNumber.from(0),
    });

    const result = await settled();

    expect(result.current.exits.map(exit => exit.id)).toEqual(['7', '8']);
  });

  it("lists holds from Zero's queue as well as the protocol's", async () => {
    // The two pointers are independently settable. If they diverge, a Zero
    // close form promises the holder they can release on this page, and the
    // page must not be looking at a different queue.
    mockZeroContract.mockResolvedValue({ address: OTHER_BORROWER_OPERATIONS });
    mockQueuePointer.mockImplementation(async (address: string) =>
      address === PROTOCOL ? QUEUE : ZERO_QUEUE,
    );
    mockGetActive.mockImplementation(async (queueAddress: string) => ({
      ids: [BigNumber.from(queueAddress === QUEUE.toLowerCase() ? 7 : 9)],
      nextCursor: BigNumber.from(0),
    }));

    const result = await settled();

    expect(result.current.exits.map(exit => exit.id).sort()).toEqual([
      '7',
      '9',
    ]);
    // Each row carries the queue that holds it: an id is only accepted by its
    // own queue contract.
    expect(result.current.exits.map(exit => exit.queueAddress).sort()).toEqual([
      QUEUE.toLowerCase(),
      ZERO_QUEUE.toLowerCase(),
    ]);
  });

  it('keeps showing escrowed funds after the queue pointer is cleared', async () => {
    // Unwiring the pointer is one of the ways the perimeter is switched off,
    // and the queue still holds and still releases. Held funds must not
    // disappear from the page that releases them.
    mockGetActive.mockResolvedValue({
      ids: [BigNumber.from(7)],
      nextCursor: BigNumber.from(0),
    });
    const first = await settled();
    expect(first.current.exits).toHaveLength(1);

    mockQueuePointer.mockResolvedValue(ZERO_ADDRESS);
    const second = await settled();

    expect(second.current.exits).toHaveLength(1);
    expect(second.current.exits[0].queueAddress).toBe(QUEUE.toLowerCase());
  });

  it('names the asset each amount is denominated in', async () => {
    mockGetActive.mockResolvedValue({
      ids: [BigNumber.from(7)],
      nextCursor: BigNumber.from(0),
    });
    mockGetRequest.mockResolvedValue(request({ token: RUSDT }));

    const result = await settled();

    expect(result.current.exits[0].tokenSymbol).toBe('RUSDT');
    expect(result.current.exits[0].amount?.toString()).toBe('1.5');
  });

  it('prints no amount for an asset whose decimals it cannot resolve', async () => {
    // Scaling by an assumed 18 would be silently wrong by orders of magnitude
    // for a 6- or 8-decimal asset.
    mockGetActive.mockResolvedValue({
      ids: [BigNumber.from(7)],
      nextCursor: BigNumber.from(0),
    });
    mockGetRequest.mockResolvedValue(
      request({ token: '0x4444444444444444444444444444444444444444' }),
    );

    const result = await settled();

    expect(result.current.exits[0].amount).toBeUndefined();
    expect(result.current.exits[0].tokenSymbol).toBeUndefined();
  });

  it('flags a request whose recorded owner is a contract', async () => {
    mockGetActive.mockResolvedValue({
      ids: [BigNumber.from(7)],
      nextCursor: BigNumber.from(0),
    });
    mockGetCode.mockResolvedValue('0x6001600101');

    const result = await settled();

    expect(result.current.exits[0].ownerHasCode).toBe(true);
  });

  it('does not flag a request whose recorded owner is a plain wallet', async () => {
    mockGetActive.mockResolvedValue({
      ids: [BigNumber.from(7)],
      nextCursor: BigNumber.from(0),
    });
    mockGetCode.mockResolvedValue('0x');

    const result = await settled();

    expect(result.current.exits[0].ownerHasCode).toBe(false);
  });

  it('does not flag a request when the owner code read fails, and reports the vault as read', async () => {
    mockGetActive.mockResolvedValue({
      ids: [BigNumber.from(7)],
      nextCursor: BigNumber.from(0),
    });
    mockGetCode.mockRejectedValue(networkError());

    const result = await settled();

    expect(result.current.exits[0].ownerHasCode).toBe(false);
    expect(result.current.unknown).toBe(false);
  });

  it('reads an owner shared by several requests only once', async () => {
    mockGetActive.mockResolvedValue({
      ids: [BigNumber.from(7), BigNumber.from(8)],
      nextCursor: BigNumber.from(0),
    });
    mockGetRequest.mockImplementation(async (_address: string, id: string) =>
      request({ owner: ACCOUNT }),
    );

    await settled();

    expect(mockGetCode).toHaveBeenCalledTimes(1);
  });
});
