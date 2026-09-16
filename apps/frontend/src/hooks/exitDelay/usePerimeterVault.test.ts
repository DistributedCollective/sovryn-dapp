import { renderHook, waitFor } from '@testing-library/react';

import { BigNumber } from 'ethers';

import {
  JsonRpcStub,
  captureCallFailure,
  startJsonRpcStub,
} from '../../utils/testing/jsonRpcStub';
import { PointerRead } from './readPerimeterPointer';
import { usePerimeterVault } from './usePerimeterVault';

/**
 * "No delayed withdrawals" is a definitive statement. These tests hold
 * apart an honest empty queue, a consumer with no delay leg, and every read
 * that did not complete — which must reach the page as unknown.
 */

const ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const PROTOCOL = '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7';
const BORROWER_OPERATIONS = '0x5B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39';
// The hook remembers queue addresses for the life of the tab, keyed by the
// consumer they came from. Tests that move a pointer use their own consumer so
// nothing they leave behind is remembered by another test.
const OTHER_BORROWER_OPERATIONS = '0x6B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39';
const MOVING_PROTOCOL = '0x7A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7';
const UNWIRED_PROTOCOL = '0x8A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7';
const QUEUE = '0x1111111111111111111111111111111111111111';
const ZERO_QUEUE = '0x2222222222222222222222222222222222222222';
const NEW_QUEUE = '0x4444444444444444444444444444444444444444';
const RECEIVER = '0x3333333333333333333333333333333333333333';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
/** rUSDT on RSK — 18 decimals, like every asset on these surfaces today. */
const RUSDT = '0xEf213441a85DF4d7acBdAe0Cf78004E1e486BB96';

let mockProtocolAddress = PROTOCOL;

const mockReadPointer = jest.fn();
const mockGetActive = jest.fn();
const mockGetRequest = jest.fn();
const mockBlockStateOf = jest.fn();
const mockPaused = jest.fn();
const mockZeroContract = jest.fn();
const mockGetCode = jest.fn();

jest.mock('./readPerimeterPointer', () => ({
  readPerimeterPointer: (...args: unknown[]) => mockReadPointer(...args),
}));

jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    Contract: function (address: string) {
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

// Short enough that the deadline test below does not wait ten real seconds.
jest.mock('./useExitDelay', () => ({
  ...jest.requireActual('./useExitDelay'),
  EXIT_DELAY_QUOTE_TIMEOUT_MS: 50,
}));

jest.mock('../../store/rxjs/provider-cache', () => ({
  asyncCall: (_key: string, fn: () => unknown) => fn(),
}));

jest.mock('../useAccount', () => ({
  useAccount: () => ({ account: ACCOUNT }),
}));

jest.mock('../useGetContract', () => ({
  useGetProtocolContract: () => ({ address: mockProtocolAddress }),
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

const address = (value: string): PointerRead => ({
  kind: 'address',
  address: value,
});
const ABSENT: PointerRead = { kind: 'absent' };
const UNREADABLE: PointerRead = { kind: 'unreadable' };

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

const holding = (...ids: number[]) =>
  mockGetActive.mockResolvedValue({
    ids: ids.map(id => BigNumber.from(id)),
    nextCursor: BigNumber.from(0),
  });

const settled = async () => {
  const hook = renderHook(() => usePerimeterVault());
  await waitFor(() => expect(hook.result.current.loading).toBe(false));
  return hook.result;
};

describe('usePerimeterVault', () => {
  let stub: JsonRpcStub;
  let transportFailure: unknown;

  beforeAll(async () => {
    stub = await startJsonRpcStub();
    transportFailure = await captureCallFailure(stub, {
      status: 503,
      body: '<html>Service Unavailable</html>',
    });
  });

  afterAll(() => stub.close());

  beforeEach(() => {
    mockProtocolAddress = PROTOCOL;
    mockZeroContract.mockResolvedValue({ address: BORROWER_OPERATIONS });
    mockReadPointer.mockImplementation(async (_chainId, consumer: string) =>
      consumer === PROTOCOL ? address(QUEUE) : address(ZERO_ADDRESS),
    );
    holding();
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

  it("reads each consumer's queue pointer", async () => {
    await settled();

    expect(mockReadPointer).toHaveBeenCalledWith(
      '0x1e',
      PROTOCOL,
      'exitDelayQueue',
    );
    expect(mockReadPointer).toHaveBeenCalledWith(
      '0x1e',
      BORROWER_OPERATIONS,
      'exitDelayQueue',
    );
  });

  it('reports nothing held, as a completed read, when no consumer has a delay leg', async () => {
    mockProtocolAddress = UNWIRED_PROTOCOL;
    mockReadPointer.mockResolvedValue(ABSENT);

    const result = await settled();

    expect(result.current.unknown).toBe(false);
    expect(result.current.exits).toHaveLength(0);
    expect(mockGetActive).not.toHaveBeenCalled();
  });

  it('reports unknown when a queue pointer could not be read', async () => {
    mockReadPointer.mockResolvedValue(UNREADABLE);

    const result = await settled();

    expect(result.current.unknown).toBe(true);
  });

  it("reports unknown when Zero's pointer could not be read, and still lists the protocol's holds", async () => {
    holding(7);
    mockReadPointer.mockImplementation(async (_chainId, consumer: string) =>
      consumer === PROTOCOL ? address(QUEUE) : UNREADABLE,
    );

    const result = await settled();

    expect(result.current.exits.map(exit => exit.id)).toEqual(['7']);
    expect(result.current.unknown).toBe(true);
  });

  it("reports unknown when Zero's BorrowerOperations address cannot be resolved", async () => {
    mockZeroContract.mockRejectedValue(new Error('no artifact'));

    const result = await settled();

    expect(result.current.unknown).toBe(true);
  });

  it('reports unknown when a queue read fails, never an empty vault', async () => {
    mockGetActive.mockRejectedValue(transportFailure);

    const result = await settled();

    expect(result.current.unknown).toBe(true);
    expect(result.current.exits).toHaveLength(0);
  });

  it('stays loading until the first attempt resolves', () => {
    mockGetActive.mockReturnValue(new Promise(() => undefined));

    const { result } = renderHook(() => usePerimeterVault());

    expect(result.current.loading).toBe(true);
  });

  it('reports unknown, not loading forever, once its deadline passes without a value', async () => {
    // A block number that never arrives — the RPC endpoint refusing every
    // request, say — leaves this same shape: no fetch ever lands. The vault
    // must stop reporting a loader that will never end and say it could not
    // be read, the way every other failed read here does.
    mockGetActive.mockReturnValue(new Promise(() => undefined));

    const { result } = renderHook(() => usePerimeterVault());
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unknown).toBe(true);
    expect(result.current.exits).toHaveLength(0);
  });

  it('de-duplicates ids repeated by a best-effort getActive page', async () => {
    // The contract documents getActive as best-effort over a mutating set. A
    // repeated id puts the same id twice into one executeExits call, where the
    // second pass reverts AlreadyTerminal and takes the batch with it.
    holding(7, 7, 8);

    const result = await settled();

    expect(result.current.exits.map(exit => exit.id)).toEqual(['7', '8']);
  });

  it("reads every party's block state once and marks a clear hold as unblocked", async () => {
    holding(7);

    const result = await settled();

    expect(result.current.exits).toHaveLength(1);
    expect(result.current.exits[0].blockedState).toBeUndefined();
    expect(result.current.exits[0].blockedStateUnreadable).toBe(false);
    const parties = mockBlockStateOf.mock.calls.map(([, party]) =>
      (party as string).toLowerCase(),
    );
    expect(new Set(parties)).toEqual(
      new Set([ACCOUNT.toLowerCase(), RECEIVER.toLowerCase()]),
    );
    expect(parties).toHaveLength(2);
  });

  it('marks a hold whose receiver is frozen as frozen', async () => {
    holding(7);
    mockBlockStateOf.mockImplementation(async (_queue: string, party: string) =>
      party.toLowerCase() === RECEIVER.toLowerCase() ? 1 : 0,
    );

    const result = await settled();

    expect(result.current.exits[0].blockedState).toBe(1);
  });

  it('marks a hold whose originator is blacklisted as blacklisted', async () => {
    holding(7);
    mockGetRequest.mockResolvedValue(request({ originator: RECEIVER }));
    mockBlockStateOf.mockImplementation(async (_queue: string, party: string) =>
      party.toLowerCase() === RECEIVER.toLowerCase() ? 2 : 0,
    );

    const result = await settled();

    expect(result.current.exits[0].blockedState).toBe(2);
  });

  it('lets a frozen party outrank a blacklisted one on the same hold', async () => {
    holding(7);
    mockBlockStateOf.mockImplementation(async (_queue: string, party: string) =>
      party.toLowerCase() === RECEIVER.toLowerCase() ? 1 : 2,
    );

    const result = await settled();

    expect(result.current.exits[0].blockedState).toBe(1);
  });

  it('reports the vault as unknown when a block-state read fails, and still lists the row', async () => {
    holding(7);
    mockBlockStateOf.mockRejectedValue(new Error('rpc down'));

    const result = await settled();

    expect(result.current.exits).toHaveLength(1);
    expect(result.current.exits[0].blockedState).toBeUndefined();
    // The row itself must say it could not be checked, not read as Ready:
    // the press-time check is a second line of defence, not the only one.
    expect(result.current.exits[0].blockedStateUnreadable).toBe(true);
    expect(result.current.unknown).toBe(true);
  });

  it('reports the vault as unknown when a block state is outside the known values', async () => {
    holding(7);
    mockBlockStateOf.mockResolvedValue(3);

    const result = await settled();

    expect(result.current.exits).toHaveLength(1);
    expect(result.current.exits[0].blockedState).toBeUndefined();
    expect(result.current.exits[0].blockedStateUnreadable).toBe(true);
    expect(result.current.unknown).toBe(true);
  });

  it('marks a row unreadable only for the party whose read failed, not for the whole hold when another party is confirmed frozen', async () => {
    // A confirmed fact about one party is worth keeping even when another
    // party's own read failed alongside it.
    holding(7);
    mockBlockStateOf.mockImplementation(
      async (_queue: string, party: string) => {
        if (party.toLowerCase() === RECEIVER.toLowerCase()) {
          return 1;
        }
        throw new Error('rpc down');
      },
    );

    const result = await settled();

    expect(result.current.exits[0].blockedState).toBe(1);
    expect(result.current.exits[0].blockedStateUnreadable).toBe(false);
  });

  it('reports the vault as unknown when a request comes back with the zero status, and still lists the row', async () => {
    // The zero status means the queue holds no such request at all — a node
    // that did not state the record, not a withdrawal settled with a real
    // answer of zero-everything.
    holding(7);
    mockGetRequest.mockResolvedValue(request({ status: 0 }));

    const result = await settled();

    expect(result.current.exits).toHaveLength(1);
    expect(result.current.exits[0].status).toBe(0);
    expect(result.current.unknown).toBe(true);
  });

  it('reports the vault as unknown when a request status is outside the values the queue defines', async () => {
    holding(7);
    mockGetRequest.mockResolvedValue(request({ status: 9 }));

    const result = await settled();

    expect(result.current.exits).toHaveLength(1);
    expect(result.current.unknown).toBe(true);
  });

  it("lists holds from Zero's queue as well as the protocol's", async () => {
    // The two pointers are independently settable. If they diverge, a Zero
    // close form promises the holder they can release on this page, and the
    // page must not be looking at a different queue.
    mockZeroContract.mockResolvedValue({ address: OTHER_BORROWER_OPERATIONS });
    mockReadPointer.mockImplementation(async (_chainId, consumer: string) =>
      consumer === PROTOCOL ? address(QUEUE) : address(ZERO_QUEUE),
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

  it('keeps listing the queue a consumer pointed at earlier in the tab after the pointer moves', async () => {
    // The setters refuse zero but accept a new queue. Requests left in the old
    // queue are still held there and still released there.
    mockProtocolAddress = MOVING_PROTOCOL;
    mockReadPointer.mockImplementation(async (_chainId, consumer: string) =>
      consumer === MOVING_PROTOCOL ? address(QUEUE) : ABSENT,
    );
    mockGetActive.mockImplementation(async (queueAddress: string) => ({
      ids: [BigNumber.from(queueAddress === QUEUE.toLowerCase() ? 7 : 9)],
      nextCursor: BigNumber.from(0),
    }));
    const first = await settled();
    expect(first.current.exits.map(exit => exit.id)).toEqual(['7']);

    mockReadPointer.mockImplementation(async (_chainId, consumer: string) =>
      consumer === MOVING_PROTOCOL ? address(NEW_QUEUE) : ABSENT,
    );
    const second = await settled();

    expect(second.current.exits.map(exit => exit.queueAddress).sort()).toEqual([
      QUEUE.toLowerCase(),
      NEW_QUEUE.toLowerCase(),
    ]);
  });

  it('names the asset each amount is denominated in', async () => {
    holding(7);
    mockGetRequest.mockResolvedValue(request({ token: RUSDT }));

    const result = await settled();

    expect(result.current.exits[0].tokenSymbol).toBe('RUSDT');
    expect(result.current.exits[0].amount?.toString()).toBe('1.5');
  });

  it('prints no amount for an asset whose decimals it cannot resolve', async () => {
    // Scaling by an assumed 18 would be silently wrong by orders of magnitude
    // for a 6- or 8-decimal asset.
    holding(7);
    mockGetRequest.mockResolvedValue(
      request({ token: '0x5555555555555555555555555555555555555555' }),
    );

    const result = await settled();

    expect(result.current.exits[0].amount).toBeUndefined();
    expect(result.current.exits[0].tokenSymbol).toBeUndefined();
  });

  it('flags a request whose recorded owner is a contract', async () => {
    holding(7);
    mockGetCode.mockResolvedValue('0x6001600101');

    const result = await settled();

    expect(result.current.exits[0].ownerHasCode).toBe(true);
  });

  it('flags a request whose recorded owner is a plain wallet as such', async () => {
    holding(7);
    mockGetCode.mockResolvedValue('0x');

    const result = await settled();

    expect(result.current.exits[0].ownerHasCode).toBe(false);
  });

  it('reports the vault as unknown when an owner-code read fails, and still lists the row', async () => {
    holding(7);
    mockGetCode.mockRejectedValue(transportFailure);

    const result = await settled();

    expect(result.current.exits).toHaveLength(1);
    expect(result.current.exits[0].ownerHasCode).toBeUndefined();
    expect(result.current.unknown).toBe(true);
  });

  it('reads an owner shared by several requests only once', async () => {
    holding(7, 8);
    mockGetRequest.mockImplementation(async () => request({ owner: ACCOUNT }));

    await settled();

    expect(mockGetCode).toHaveBeenCalledTimes(1);
  });
});
