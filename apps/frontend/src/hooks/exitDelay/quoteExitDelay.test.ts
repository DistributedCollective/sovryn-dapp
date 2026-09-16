import { utils } from 'ethers';

import {
  JsonRpcStub,
  RSK_PROTOCOL_TARGET_NOT_ACTIVE,
  RSK_REVERT_WITHOUT_DATA,
  StubAnswer,
  addressResult,
  revertReasonData,
  selectorOf,
  startJsonRpcStub,
} from '../../utils/testing/jsonRpcStub';
import { NO_DELAY, UNREADABLE, quoteExitDelay } from './quoteExitDelay';

/**
 * The delay fails CLOSED on chain: a consumer that cannot quote the delay
 * reverts the withdrawal or escrows it. So a hold is reported as absent only
 * when the chain positively said so, and every read that did not complete is
 * reported as unreadable. These tests serve the RSK node's own answers through
 * the app's real provider stack.
 */

let mockRpcUrl = '';

jest.mock('@sovryn/ethers-provider', () => {
  const actual = jest.requireActual('@sovryn/ethers-provider');
  return {
    ...actual,
    getProvider: () =>
      actual.getProvider({
        id: '0x1e',
        label: 'RSK',
        token: 'RBTC',
        rpcUrl: [mockRpcUrl],
        blockExplorerUrl: '',
      }),
  };
});

// Every read goes to the node; only the keys the reads are cached under are
// recorded.
let mockCacheKeys: string[] = [];
jest.mock('../../store/rxjs/provider-cache', () => ({
  asyncCall: (key: string, fn: () => unknown) => {
    mockCacheKeys.push(key);
    return fn();
  },
}));

const ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const PROTOCOL = '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7';
const BORROWER_OPERATIONS = '0x5B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39';
const QUEUE = '0x1111111111111111111111111111111111111111';
const CONTROLLER = '0x99994b4522483DE17F31a5bC010c5901AdD3440E';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const SURFACE =
  '0xd4896528a9fba849e3d3db442dea05ef8f08c93e00cc760acac34c42a7dacffe';
const SUB_PRODUCT = '0x0000000000000000000000000000000000000123';

const QUEUE_GETTER = selectorOf('exitDelayQueue()');
const CONTROLLER_GETTER = selectorOf('exitFeeController()');
const CONTROLLER_ABI = new utils.Interface([
  'function quoteExitDelayFor(address rawOriginator, address owner, address receiver, bytes32 surfaceId, address subProduct) view returns (uint32 d, address effOrig, address effOwner)',
]);
const QUOTE = CONTROLLER_ABI.getSighash('quoteExitDelayFor');

const delayResult = (seconds: number): StubAnswer => ({
  result: CONTROLLER_ABI.encodeFunctionResult('quoteExitDelayFor', [
    seconds,
    ACCOUNT,
    ACCOUNT,
  ]),
});

const TRANSPORT_FAILURES: [string, StubAnswer][] = [
  ['an HTTP 503', { status: 503, body: '<html>Service Unavailable</html>' }],
  [
    'a JSON-RPC rate limit',
    { error: { code: -32005, message: 'rate limit exceeded' } },
  ],
  ['a body that is not JSON', { raw: '<html>maintenance</html>' }],
  ['an empty result', { result: '0x' }],
  ['a dropped connection', { drop: true }],
];

const quote = (consumerAddress = PROTOCOL) =>
  quoteExitDelay({
    chainId: '0x1e',
    consumerAddress,
    account: ACCOUNT,
    surfaceId: SURFACE,
    subProduct: SUB_PRODUCT,
  });

describe('quoteExitDelay', () => {
  let stub: JsonRpcStub;

  beforeAll(async () => {
    stub = await startJsonRpcStub();
    mockRpcUrl = stub.url;
  });

  afterEach(() => {
    stub.reset();
    mockCacheKeys = [];
  });

  afterAll(() => stub.close());

  /** A consumer wired to a queue and a controller. */
  const wire = (consumer = PROTOCOL) => {
    stub.onCall(consumer, QUEUE_GETTER, addressResult(QUEUE));
    stub.onCall(consumer, CONTROLLER_GETTER, addressResult(CONTROLLER));
  };

  describe('when the queue getter reverts', () => {
    it('reports no hold for the lending protocol, whose queue getter reverts with a reason', async () => {
      stub.onCall(PROTOCOL, QUEUE_GETTER, RSK_PROTOCOL_TARGET_NOT_ACTIVE);
      stub.onCall(PROTOCOL, CONTROLLER_GETTER, addressResult(CONTROLLER));
      stub.onCall(CONTROLLER, QUOTE, delayResult(172800));

      expect(await quote()).toEqual(NO_DELAY);
      expect(stub.callCount(CONTROLLER, QUOTE)).toBe(0);
    });

    it('reports no hold for Zero, whose queue getter reverts with no data', async () => {
      stub.onCall(BORROWER_OPERATIONS, QUEUE_GETTER, RSK_REVERT_WITHOUT_DATA);
      stub.onCall(
        BORROWER_OPERATIONS,
        CONTROLLER_GETTER,
        addressResult(CONTROLLER),
      );
      stub.onCall(CONTROLLER, QUOTE, delayResult(172800));

      expect(await quote(BORROWER_OPERATIONS)).toEqual(NO_DELAY);
      expect(stub.callCount(CONTROLLER, QUOTE)).toBe(0);
    });
  });

  describe('when a pointer read does not complete', () => {
    it.each(TRANSPORT_FAILURES)(
      'reports unreadable when the queue pointer read meets %s',
      async (_name, answer) => {
        stub.onCall(PROTOCOL, QUEUE_GETTER, answer);
        stub.onCall(PROTOCOL, CONTROLLER_GETTER, addressResult(CONTROLLER));

        expect(await quote()).toEqual(UNREADABLE);
      },
    );

    it.each(TRANSPORT_FAILURES)(
      'reports unreadable when the controller pointer read meets %s',
      async (_name, answer) => {
        stub.onCall(PROTOCOL, QUEUE_GETTER, addressResult(QUEUE));
        stub.onCall(PROTOCOL, CONTROLLER_GETTER, answer);

        expect(await quote()).toEqual(UNREADABLE);
      },
    );

    it('reports unreadable when the controller getter reverts on a consumer whose queue getter answered', async () => {
      // The queue getter proves the delay leg is installed; a controller read
      // that then reverts is no statement that nothing is held.
      stub.onCall(PROTOCOL, QUEUE_GETTER, addressResult(QUEUE));
      stub.onCall(PROTOCOL, CONTROLLER_GETTER, RSK_PROTOCOL_TARGET_NOT_ACTIVE);

      expect(await quote()).toEqual(UNREADABLE);
    });
  });

  describe('on a wired consumer', () => {
    it('reports the delay the controller quotes', async () => {
      wire();
      stub.onCall(CONTROLLER, QUOTE, delayResult(172800));

      expect(await quote()).toEqual({ delaySeconds: 172800, unknown: false });
    });

    it('quotes the account as all three identities, with the surface and product', async () => {
      wire();
      stub.onCall(CONTROLLER, QUOTE, {
        error: { code: -32601, message: 'unexpected arguments' },
      });
      stub.onCall(
        CONTROLLER,
        CONTROLLER_ABI.encodeFunctionData('quoteExitDelayFor', [
          ACCOUNT,
          ACCOUNT,
          ACCOUNT,
          SURFACE,
          SUB_PRODUCT,
        ]),
        delayResult(3600),
      );

      expect(await quote()).toEqual({ delaySeconds: 3600, unknown: false });
    });

    it('reports no hold when the controller quotes zero', async () => {
      wire();
      stub.onCall(CONTROLLER, QUOTE, delayResult(0));

      expect(await quote()).toEqual(NO_DELAY);
    });

    it('caches the quote under a key naming the chain, controller, queue, surface, product and account', async () => {
      // A rotated controller or queue asks a new question; its answer must not
      // be served from the old pair's entry.
      wire();
      stub.onCall(CONTROLLER, QUOTE, delayResult(3600));

      await quote();

      expect(mockCacheKeys).toContain(
        [
          'exitDelay/quoteFor',
          '0x1e',
          CONTROLLER.toLowerCase(),
          QUEUE.toLowerCase(),
          SURFACE,
          SUB_PRODUCT.toLowerCase(),
          ACCOUNT.toLowerCase(),
        ].join('/'),
      );
    });

    it('reports unreadable when the controller reverts the quote', async () => {
      wire();
      stub.onCall(CONTROLLER, QUOTE, {
        error: {
          code: -32015,
          message: 'VM Exception while processing transaction: revert',
          data: revertReasonData('paused'),
        },
      });

      expect(await quote()).toEqual(UNREADABLE);
    });

    it('reports unreadable when the quote read does not complete', async () => {
      wire();
      stub.onCall(CONTROLLER, QUOTE, { status: 503, body: 'unavailable' });

      expect(await quote()).toEqual(UNREADABLE);
    });

    it('reports no hold when no controller is pinned, without quoting', async () => {
      stub.onCall(PROTOCOL, QUEUE_GETTER, addressResult(QUEUE));
      stub.onCall(PROTOCOL, CONTROLLER_GETTER, addressResult(ZERO_ADDRESS));

      expect(await quote()).toEqual(NO_DELAY);
      expect(stub.callCount(CONTROLLER, QUOTE)).toBe(0);
    });
  });

  describe('on a consumer whose queue pointer is unset', () => {
    beforeEach(() => {
      stub.onCall(PROTOCOL, QUEUE_GETTER, addressResult(ZERO_ADDRESS));
      stub.onCall(PROTOCOL, CONTROLLER_GETTER, addressResult(CONTROLLER));
    });

    it('reports no hold when the controller quotes zero', async () => {
      stub.onCall(CONTROLLER, QUOTE, delayResult(0));

      expect(await quote()).toEqual(NO_DELAY);
      expect(stub.callCount(CONTROLLER, QUOTE)).toBe(1);
    });

    it('does not report the withdrawal as paid now when the controller quotes a delay', async () => {
      // The consumer then has nowhere to escrow and reverts the withdrawal.
      stub.onCall(CONTROLLER, QUOTE, delayResult(172800));

      expect(await quote()).toEqual(UNREADABLE);
    });
  });
});
