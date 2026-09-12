import { providers, utils } from 'ethers';

import { Chain, getProvider } from '@sovryn/ethers-provider';

import {
  JsonRpcStub,
  RSK_REVERT_WITHOUT_DATA,
  startJsonRpcStub,
} from '../../utils/testing/jsonRpcStub';
import { callRaw } from './rawCall';

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

    expect(await callRaw(appProvider, call)).toEqual({
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

    expect(await callRaw(appProvider, call)).toEqual({
      kind: 'reverted',
      data,
    });
  });

  it('reports a revert with no data as reverted', async () => {
    stub.onCall(QUEUE, EXECUTE_EXIT, RSK_REVERT_WITHOUT_DATA);

    expect(await callRaw(appProvider, call)).toEqual({
      kind: 'reverted',
      data: '0x',
    });
  });

  it('reports a call the node did not answer as unreadable', async () => {
    stub.onCall(QUEUE, EXECUTE_EXIT, { status: 503, body: 'unavailable' });

    expect(await callRaw(appProvider, call)).toEqual({ kind: 'unreadable' });
  });

  it("makes the call from the caller's address", async () => {
    stub.onCall(QUEUE, EXECUTE_EXIT, { result: '0x' });

    await callRaw(appProvider, call);

    expect(stub.callsTo(QUEUE, EXECUTE_EXIT)).toEqual([
      { from: HOLDER, data: call.data },
    ]);
  });

  it('treats a result the caller does not accept as no answer', async () => {
    stub.onCall(QUEUE, EXECUTE_EXIT, { result: '0x' });

    expect(await callRaw(appProvider, call, result => result !== '0x')).toEqual(
      { kind: 'unreadable' },
    );
  });
});
