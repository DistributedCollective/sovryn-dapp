import { providers, utils } from 'ethers';

import { Chain, getProvider } from '@sovryn/ethers-provider';

import {
  JsonRpcStub,
  RSK_REVERT_WITHOUT_DATA,
  startJsonRpcStub,
} from '../../utils/testing/jsonRpcStub';
import { boundedBy, callRaw } from './rawCall';

describe('boundedBy', () => {
  it('passes on an answer that arrives within the time given', async () => {
    await expect(boundedBy(Promise.resolve('0x'), 200)).resolves.toBe('0x');
  });

  it('passes on a failure that arrives within the time given', async () => {
    await expect(
      boundedBy(Promise.reject(new Error('refused')), 200),
    ).rejects.toThrow('refused');
  });

  it('rejects once the time given passes with no answer', async () => {
    const started = Date.now();

    await expect(boundedBy(new Promise(() => undefined), 50)).rejects.toThrow();
    expect(Date.now() - started).toBeLessThan(1_000);
  });
});

/**
 * The app's provider path reports a revert and a transport failure alike and
 * drops the node's revert data. A release dry run needs both the distinction
 * and the data, to tell the holder why the queue would refuse. These tests send
 * the call through the app's real fallback provider to a local node.
 */

const HOLDER = '0x1111111111111111111111111111111111111111';
const QUEUE = '0x9999999999999999999999999999999999999999';

const QUEUE_ABI = new utils.Interface([
  'function executeExit(uint256 requestId)',
]);
const QUEUE_ERRORS = new utils.Interface(['error QueuePaused()']);
const EXECUTE_EXIT = QUEUE_ABI.getSighash('executeExit');

const call = {
  from: HOLDER,
  to: QUEUE,
  data: QUEUE_ABI.encodeFunctionData('executeExit', [7]),
};

/** What a function that returns nothing gives back when it executes. */
const VOID_RESULT = (result: string) => result === '0x';

describe('callRaw', () => {
  let stub: JsonRpcStub;
  let appProvider: providers.Provider;

  beforeAll(async () => {
    stub = await startJsonRpcStub();
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

  it('returns what a call the node executed returned', async () => {
    stub.onCall(QUEUE, EXECUTE_EXIT, { result: '0x' });

    expect(await callRaw(appProvider, call, VOID_RESULT)).toEqual({
      kind: 'result',
      data: '0x',
    });
  });

  it("keeps the queue's revert data, which the app's fallback provider drops", async () => {
    const data = QUEUE_ERRORS.encodeErrorResult('QueuePaused', []);
    stub.onCall(QUEUE, EXECUTE_EXIT, {
      error: {
        code: -32015,
        message: 'VM Exception while processing transaction: revert',
        data,
      },
    });

    expect(await callRaw(appProvider, call, VOID_RESULT)).toEqual({
      kind: 'reverted',
      data,
    });
  });

  it('reports a revert with no data as reverted', async () => {
    stub.onCall(QUEUE, EXECUTE_EXIT, RSK_REVERT_WITHOUT_DATA);

    expect(await callRaw(appProvider, call, VOID_RESULT)).toEqual({
      kind: 'reverted',
      data: '0x',
    });
  });

  it('reports a call the node did not answer as unreadable', async () => {
    stub.onCall(QUEUE, EXECUTE_EXIT, { status: 503, body: 'unavailable' });

    expect(await callRaw(appProvider, call, VOID_RESULT)).toEqual({
      kind: 'unreadable',
    });
  });

  it("makes the call from the caller's address", async () => {
    stub.onCall(QUEUE, EXECUTE_EXIT, { result: '0x' });

    await callRaw(appProvider, call, VOID_RESULT);

    expect(stub.callsTo(QUEUE, EXECUTE_EXIT)).toEqual([
      { from: HOLDER, data: call.data },
    ]);
  });

  it('gives up on a backend that does not answer within the time it is given', async () => {
    stub.onCall(QUEUE, EXECUTE_EXIT, { hang: true });
    const started = Date.now();

    expect(await callRaw(appProvider, call, VOID_RESULT, 200)).toEqual({
      kind: 'unreadable',
    });
    expect(Date.now() - started).toBeLessThan(2_000);
  });

  it('treats a result the caller does not accept as no answer', async () => {
    stub.onCall(QUEUE, EXECUTE_EXIT, { result: '0x' });

    expect(await callRaw(appProvider, call, result => result !== '0x')).toEqual(
      { kind: 'unreadable' },
    );
  });
});
