import { Contract, providers } from 'ethers';

import { Chain, getProvider } from '@sovryn/ethers-provider';

import {
  JsonRpcStub,
  RSK_LOAN_TOKEN_TARGET_NOT_ACTIVE,
  RSK_PROTOCOL_TARGET_NOT_ACTIVE,
  RSK_REVERT_WITHOUT_DATA,
  StubAnswer,
  addressResult,
  selectorOf,
  startJsonRpcStub,
} from '../../utils/testing/jsonRpcStub';
import { readAddressGetter } from './readPerimeterPointer';

/**
 * A pointer may be reported as absent only when the node positively answered
 * that the getter reverted. The installed ethers reports a revert and a
 * transport failure with the same CALL_EXCEPTION on the app's call path, so
 * these tests drive the app's real provider against a local node and hold the
 * two apart at the JSON-RPC answer itself.
 */

const CONSUMER = '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7';
const QUEUE = '0x1111111111111111111111111111111111111111';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const QUEUE_GETTER = selectorOf('exitDelayQueue()');

const TRANSPORT_FAILURES: [string, StubAnswer][] = [
  ['an HTTP 503', { status: 503, body: '<html>Service Unavailable</html>' }],
  [
    'an HTTP 502 gateway page',
    { status: 502, body: '<html>Bad Gateway</html>' },
  ],
  [
    'a JSON-RPC rate limit',
    { error: { code: -32005, message: 'rate limit exceeded' } },
  ],
  [
    'a JSON-RPC upstream timeout',
    { error: { code: -32603, message: 'upstream request timeout' } },
  ],
  ['a body that is not JSON', { raw: '<html>maintenance</html>' }],
  ['an empty result', { result: '0x' }],
  ['a dropped connection', { drop: true }],
];

describe('readAddressGetter', () => {
  let stub: JsonRpcStub;
  let appProvider: providers.Provider;

  beforeAll(async () => {
    stub = await startJsonRpcStub();
    // The app reaches RSK mainnet through an array of RPC URLs, which
    // `getProvider` wraps in the app's own fallback provider.
    appProvider = getProvider({
      id: '0x1e',
      label: 'RSK',
      token: 'RBTC',
      rpcUrl: [stub.url],
      blockExplorerUrl: '',
    } as Chain);
  });

  afterEach(() => stub.reset());

  afterAll(() => stub.close());

  const read = (provider: providers.Provider = appProvider) =>
    readAddressGetter(provider, CONSUMER, 'exitDelayQueue');

  describe('the node answered', () => {
    it('returns the address the getter holds', async () => {
      stub.onCall(CONSUMER, QUEUE_GETTER, addressResult(QUEUE));

      expect(await read()).toEqual({ kind: 'address', address: QUEUE });
    });

    it('returns the zero address as an address, not as absent', async () => {
      stub.onCall(CONSUMER, QUEUE_GETTER, addressResult(ZERO_ADDRESS));

      expect(await read()).toEqual({ kind: 'address', address: ZERO_ADDRESS });
    });

    it.each([
      ['the lending protocol proxy', RSK_PROTOCOL_TARGET_NOT_ACTIVE],
      ['a loan token proxy', RSK_LOAN_TOKEN_TARGET_NOT_ACTIVE],
      [
        "Zero's BorrowerOperations, with no revert data",
        RSK_REVERT_WITHOUT_DATA,
      ],
    ])('reports absent when %s reverts the getter', async (_name, answer) => {
      stub.onCall(CONSUMER, QUEUE_GETTER, answer);

      expect(await read()).toEqual({ kind: 'absent' });
    });
  });

  describe('the node did not answer', () => {
    it.each(TRANSPORT_FAILURES)(
      'reports unreadable for %s',
      async (_name, answer) => {
        stub.onCall(CONSUMER, QUEUE_GETTER, answer);

        expect(await read()).toEqual({ kind: 'unreadable' });
      },
    );

    it('reports unreadable for an HTTP 429', async () => {
      // A single attempt: ethers otherwise retries a 429 with a randomised
      // backoff that can run for minutes.
      stub.onCall(CONSUMER, QUEUE_GETTER, {
        status: 429,
        body: 'Too Many Requests',
      });
      const provider = new providers.StaticJsonRpcProvider({
        url: stub.url,
        throttleLimit: 1,
        throttleSlotInterval: 1,
      });

      expect(await read(provider)).toEqual({ kind: 'unreadable' });
    });

    it('reports unreadable for a request that times out', async () => {
      stub.onCall(CONSUMER, QUEUE_GETTER, { hang: true });
      const provider = new providers.StaticJsonRpcProvider({
        url: stub.url,
        timeout: 200,
      });

      expect(await read(provider)).toEqual({ kind: 'unreadable' });
    });

    it('reports unreadable for a provider it cannot send raw requests through', async () => {
      expect(await read({} as providers.Provider)).toEqual({
        kind: 'unreadable',
      });
    });
  });

  describe("the app's ordinary call path", () => {
    // Why the reader exists: through the app's provider a revert and a
    // transport failure arrive as the same error code, with nothing left to
    // tell them apart.
    it.each([
      ['a revert with reason data', RSK_PROTOCOL_TARGET_NOT_ACTIVE],
      ['a revert without data', RSK_REVERT_WITHOUT_DATA],
      ...TRANSPORT_FAILURES,
    ])('reports %s as CALL_EXCEPTION', async (_name, answer) => {
      stub.onCall(CONSUMER, QUEUE_GETTER, answer);
      const pointer = new Contract(
        CONSUMER,
        ['function exitDelayQueue() view returns (address)'],
        appProvider,
      );

      await expect(pointer.exitDelayQueue()).rejects.toMatchObject({
        code: 'CALL_EXCEPTION',
      });
    });
  });
});
