import { utils } from 'ethers';

import {
  JsonRpcStub,
  StubAnswer,
  addressResult,
  selectorOf,
  startJsonRpcStub,
} from '../../utils/testing/jsonRpcStub';
import { quoteExitDelay } from './quoteExitDelay';

/**
 * quoteExitDelay caches its own on-chain read of the controller (see its own
 * doc comment and `quoteExitDelay.test.ts`'s "caches the quote under a key"
 * case), on the app's real shared cache — unlike `quoteExitDelay.test.ts`,
 * which mocks that cache away entirely to isolate the pointer/decode logic.
 * These tests exercise the real cache, to prove `force` actually reaches it
 * rather than only being accepted and ignored.
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

const ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const PROTOCOL = '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7';
const QUEUE = '0x1111111111111111111111111111111111111111';
const CONTROLLER = '0x99994b4522483DE17F31a5bC010c5901AdD3440E';
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

const quote = (force?: boolean) =>
  quoteExitDelay({
    chainId: '0x1e',
    consumerAddress: PROTOCOL,
    account: ACCOUNT,
    surfaceId: SURFACE,
    subProduct: SUB_PRODUCT,
    force,
  });

describe('quoteExitDelay force', () => {
  let stub: JsonRpcStub;

  beforeAll(async () => {
    stub = await startJsonRpcStub();
    mockRpcUrl = stub.url;
  });

  afterEach(() => stub.reset());

  afterAll(() => stub.close());

  it('bypasses its own cached answer when forced, so a delay armed since the last read is not masked by it', async () => {
    stub.onCall(PROTOCOL, QUEUE_GETTER, addressResult(QUEUE));
    stub.onCall(PROTOCOL, CONTROLLER_GETTER, addressResult(CONTROLLER));
    stub.onCall(CONTROLLER, QUOTE, delayResult(0));

    expect(await quote()).toEqual({ delaySeconds: 0, unknown: false });

    // The Owner arms the delay. Within the same cache lifetime, an unforced
    // read still serves the cached answer — ordinary caching, not itself a
    // bug — so this call is not the one under test.
    stub.onCall(CONTROLLER, QUOTE, delayResult(172800));
    expect(await quote()).toEqual({ delaySeconds: 0, unknown: false });
    expect(stub.callCount(CONTROLLER, QUOTE)).toBe(1);

    // Forced, it re-reads the chain rather than serving that cached answer.
    expect(await quote(true)).toEqual({
      delaySeconds: 172800,
      unknown: false,
    });
    expect(stub.callCount(CONTROLLER, QUOTE)).toBe(2);
  });
});
