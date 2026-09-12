import { act, render, renderHook } from '@testing-library/react';

import React from 'react';

import { utils } from 'ethers';
import 'jest-canvas-mock';

import { i18n } from '../../locales/i18n';
import { BlockState, ExitStatus, exitKey } from '../../utils/exitDelay';
import {
  JsonRpcStub,
  StubAnswer,
  selectorOf,
  startJsonRpcStub,
} from '../../utils/testing/jsonRpcStub';
import { ReleaseRow, usePerimeterRelease } from './usePerimeterRelease';

/**
 * A queued withdrawal whose party is frozen or blacklisted looks like any
 * other row. The block is checked when the holder presses Release: nothing is
 * sent for a row whose parties do not all read unblocked, and the holder is
 * told, in plain words, which address is blocked and how. These tests serve the
 * block states from a local node through the app's real provider.
 */

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const OTHER = '0x2222222222222222222222222222222222222222';
const RECEIVER = '0x3333333333333333333333333333333333333333';
const OTHER_RECEIVER = '0x4444444444444444444444444444444444444444';
const QUEUE = '0x9999999999999999999999999999999999999999';
const OTHER_QUEUE = '0x8888888888888888888888888888888888888888';

let mockRpcUrl = '';

const mockExecuteExit = jest.fn();
const mockExecuteExits = jest.fn();
const mockAddNotification = jest.fn();

jest.mock('@sovryn/ethers-provider', () => {
  const actual = jest.requireActual('@sovryn/ethers-provider');
  return {
    __esModule: true,
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

jest.mock('../../config/chains', () => ({
  RSK_CHAIN_ID: '0x1e',
}));

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

let mockSigner: unknown;
const mockWalletSend = jest.fn();

jest.mock('../useAccount', () => ({
  useAccount: () => ({ account: ACCOUNT, signer: mockSigner }),
}));

jest.mock('./useExecuteExit', () => ({
  useExecuteExit: () => mockExecuteExit,
  useExecuteExits: () => mockExecuteExits,
}));

jest.mock('../../contexts/NotificationContext', () => ({
  useNotificationContext: () => ({ addNotification: mockAddNotification }),
}));

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO_BYTES32 = `0x${'00'.repeat(32)}`;

const QUEUE_ABI = new utils.Interface([
  'function blockStateOf(address a) view returns (uint8)',
  'function getRequest(uint256 id) view returns (tuple(uint128 amount, uint64 createdAt, uint64 unlockAt, address originator, address owner, address receiver, address token, bytes32 surfaceId, address subProduct, uint8 status, bool unwrapOnDelivery))',
  'function executeExit(uint256 requestId)',
  'function executeExits(uint256[] ids)',
]);
/** The queue's own errors for a delivery it refuses. */
const QUEUE_ERRORS = new utils.Interface([
  'error QueuePaused()',
  'error AlreadyTerminal(uint256 id)',
  'error NotUnlocked(uint256 id, uint64 unlockAt)',
  'error NotExecutor(address caller)',
  'error ActorBlocked(address actor, uint8 state)',
]);
const BLOCK_STATE = selectorOf('blockStateOf(address)');
const GET_REQUEST = QUEUE_ABI.getSighash('getRequest');
const EXECUTE_EXIT = QUEUE_ABI.getSighash('executeExit');
const EXECUTE_EXITS = QUEUE_ABI.getSighash('executeExits');

const stateResult = (state: number): StubAnswer => ({
  result: utils.defaultAbiCoder.encode(['uint8'], [state]),
});

const requestResult = (status: ExitStatus): StubAnswer => ({
  result: QUEUE_ABI.encodeFunctionResult('getRequest', [
    [
      1,
      1,
      1,
      ACCOUNT,
      ACCOUNT,
      RECEIVER,
      ZERO_ADDRESS,
      ZERO_BYTES32,
      ZERO_ADDRESS,
      status,
      false,
    ],
  ]),
});

/** How an RSK node answers a dry run the queue refuses with one of its errors. */
const queueRefusal = (name: string, args: unknown[] = []): StubAnswer => ({
  error: {
    code: -32015,
    message: 'VM Exception while processing transaction: revert',
    data: QUEUE_ERRORS.encodeErrorResult(name, args),
  },
});

const row = (overrides: Partial<ReleaseRow> = {}): ReleaseRow => ({
  id: '7',
  queueAddress: QUEUE,
  originator: ACCOUNT,
  owner: ACCOUNT,
  receiver: RECEIVER,
  ...overrides,
});

describe('usePerimeterRelease', () => {
  let stub: JsonRpcStub;

  beforeAll(async () => {
    await i18n;
    stub = await startJsonRpcStub();
    mockRpcUrl = stub.url;
  });

  beforeEach(() => {
    // The wallet is on RSK unless a test says otherwise.
    mockWalletSend.mockImplementation(async (method: string) =>
      method === 'eth_chainId' ? '0x1e' : null,
    );
    mockSigner = { provider: { send: mockWalletSend } };
    // Every request is still queued, every party clear, and the queue accepts
    // every dry run, unless a test says otherwise.
    [QUEUE, OTHER_QUEUE].forEach(queue => {
      stub.onCall(queue, BLOCK_STATE, stateResult(BlockState.None));
      stub.onCall(queue, GET_REQUEST, requestResult(ExitStatus.Queued));
      stub.onCall(queue, EXECUTE_EXIT, { result: '0x' });
      stub.onCall(queue, EXECUTE_EXITS, { result: '0x' });
    });
  });

  afterEach(() => stub.reset());

  afterAll(() => stub.close());

  const blockOn = (queue: string, party: string, answer: StubAnswer) =>
    stub.onCall(
      queue,
      QUEUE_ABI.encodeFunctionData('blockStateOf', [party]),
      answer,
    );

  const release = async (rows: ReleaseRow[]) => {
    const onReleased = jest.fn();
    const { result } = renderHook(() => usePerimeterRelease());
    await act(async () => {
      await result.current(rows, onReleased);
    });
    return onReleased;
  };

  /** What the refusal notice says, as the holder reads it. */
  const refusalText = () => {
    const notification = mockAddNotification.mock.calls[0]?.[0];
    if (!notification) {
      return '';
    }
    const { container } = render(<>{notification.content}</>);
    return container.textContent ?? '';
  };

  it('sends a release whose parties all read unblocked', async () => {
    mockExecuteExit.mockImplementation(
      async (_queue: string, _id: string, onComplete: () => void) =>
        onComplete(),
    );

    const onReleased = await release([row()]);

    expect(mockExecuteExit).toHaveBeenCalledWith(
      QUEUE,
      '7',
      expect.any(Function),
    );
    expect(onReleased).toHaveBeenCalledWith([
      exitKey({ queueAddress: QUEUE, id: '7' }),
    ]);
    expect(mockAddNotification).not.toHaveBeenCalled();
  });

  it.each([
    ['the receiver', 'frozen', row(), RECEIVER, BlockState.Frozen],
    ['your address', 'blacklisted', row(), ACCOUNT, BlockState.Blacklisted],
    [
      'the address that started it',
      'frozen',
      row({ originator: OTHER }),
      OTHER,
      BlockState.Frozen,
    ],
    [
      'the position owner',
      'blacklisted',
      row({ owner: OTHER }),
      OTHER,
      BlockState.Blacklisted,
    ],
  ])(
    'does not send, and says %s is %s',
    async (party, state, exitRow, blockedAddress, blockState) => {
      blockOn(QUEUE, blockedAddress, stateResult(blockState));

      await release([exitRow]);

      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(mockExecuteExits).not.toHaveBeenCalled();
      expect(refusalText()).toContain(
        `Withdrawal #7 was not released because ${party} is ${state}.`,
      );
    },
  );

  it('does not send a release whose block states could not be read, and says so', async () => {
    blockOn(QUEUE, RECEIVER, { status: 503, body: 'unavailable' });

    await release([row()]);

    expect(mockExecuteExit).not.toHaveBeenCalled();
    expect(refusalText()).toContain(
      'Withdrawal #7 was not released because we could not check whether its addresses are frozen or blacklisted.',
    );
  });

  it('treats a block state outside the known values as unread', async () => {
    blockOn(QUEUE, RECEIVER, stateResult(3));

    await release([row()]);

    expect(mockExecuteExit).not.toHaveBeenCalled();
    expect(refusalText()).toContain('we could not check');
  });

  it('sends only the rows whose parties read unblocked, and reports the others', async () => {
    blockOn(QUEUE, OTHER_RECEIVER, stateResult(BlockState.Frozen));

    await release([
      row({ id: '7' }),
      row({ id: '8', receiver: OTHER_RECEIVER }),
      row({ id: '9' }),
    ]);

    expect(mockExecuteExits).toHaveBeenCalledWith(
      [{ queueAddress: QUEUE, requestIds: ['7', '9'] }],
      expect.any(Function),
    );
    const text = refusalText();
    expect(text).toContain(
      'Withdrawal #8 was not released because the receiver is frozen.',
    );
    expect(text).not.toContain('#7');
    expect(text).not.toContain('#9');
  });

  it('batches by queue and reports what each batch settled by queue and id', async () => {
    mockExecuteExits.mockImplementation(
      async (
        batches: { queueAddress: string; requestIds: string[] }[],
        onComplete: (batch: unknown) => void,
      ) => batches.forEach(onComplete),
    );

    const onReleased = await release([
      row({ id: '7' }),
      row({ id: '7', queueAddress: OTHER_QUEUE }),
    ]);

    expect(mockExecuteExits).toHaveBeenCalledWith(
      [
        { queueAddress: QUEUE, requestIds: ['7'] },
        { queueAddress: OTHER_QUEUE, requestIds: ['7'] },
      ],
      expect.any(Function),
    );
    expect(onReleased).toHaveBeenCalledWith([
      exitKey({ queueAddress: QUEUE, id: '7' }),
    ]);
    expect(onReleased).toHaveBeenCalledWith([
      exitKey({ queueAddress: OTHER_QUEUE, id: '7' }),
    ]);
  });

  describe('what the queue will still accept', () => {
    // executeExits is atomic: one id that changed since the page last read it
    // takes every other release in the batch down with it.
    const statusOf = (queue: string, id: number, answer: StubAnswer) =>
      stub.onCall(
        queue,
        QUEUE_ABI.encodeFunctionData('getRequest', [id]),
        answer,
      );

    it('leaves a row delivered by someone else off the page without an error, and sends the rest', async () => {
      statusOf(QUEUE, 8, requestResult(ExitStatus.Executed));

      const onReleased = await release([
        row({ id: '7' }),
        row({ id: '8' }),
        row({ id: '9' }),
      ]);

      expect(onReleased).toHaveBeenCalledWith([
        exitKey({ queueAddress: QUEUE, id: '8' }),
      ]);
      expect(mockExecuteExits).toHaveBeenCalledWith(
        [{ queueAddress: QUEUE, requestIds: ['7', '9'] }],
        expect.any(Function),
      );
      expect(mockAddNotification).not.toHaveBeenCalled();
    });

    it('does not send a row whose status could not be read, and says so', async () => {
      statusOf(QUEUE, 7, { status: 503, body: 'unavailable' });

      await release([row()]);

      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(
        'Withdrawal #7 was not released because we could not check whether it is still waiting.',
      );
    });

    it.each([
      ['releases are paused', queueRefusal('QueuePaused')],
      [
        '#7 is still inside its delay',
        queueRefusal('NotUnlocked', [7, 1_900_000_000]),
      ],
      ['#7 was already delivered', queueRefusal('AlreadyTerminal', [7])],
      [
        'your address is frozen',
        queueRefusal('ActorBlocked', [ACCOUNT, BlockState.Frozen]),
      ],
      [
        'your address may not release it',
        queueRefusal('NotExecutor', [ACCOUNT]),
      ],
      [
        'the queue would refuse it',
        {
          error: {
            code: -32015,
            message: 'VM Exception while processing transaction: revert',
            data: '0x',
          },
        },
      ],
    ])(
      'does not send a release the queue would refuse, and says %s',
      async (reason, answer) => {
        stub.onCall(QUEUE, EXECUTE_EXIT, answer);

        await release([row()]);

        expect(mockExecuteExit).not.toHaveBeenCalled();
        expect(refusalText()).toContain(
          `Withdrawal #7 was not released because ${reason}.`,
        );
      },
    );

    it('does not send a batch the queue would refuse, and names every withdrawal in it', async () => {
      stub.onCall(QUEUE, EXECUTE_EXITS, queueRefusal('QueuePaused'));

      await release([row({ id: '7' }), row({ id: '9' })]);

      expect(mockExecuteExits).not.toHaveBeenCalled();
      expect(refusalText()).toContain(
        'Withdrawals #7, #9 were not released because releases are paused.',
      );
    });

    it('does not send when the dry run could not be completed, and says so', async () => {
      stub.onCall(QUEUE, EXECUTE_EXIT, { status: 503, body: 'unavailable' });

      await release([row()]);

      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(
        'Withdrawal #7 was not released because we could not check whether it would go through.',
      );
    });

    it("asks the queue from the holder's own address", async () => {
      await release([row()]);

      expect(stub.callsTo(QUEUE, EXECUTE_EXIT)).toEqual([
        {
          from: ACCOUNT,
          data: QUEUE_ABI.encodeFunctionData('executeExit', [7]),
        },
      ]);
    });

    it("still sends another queue's batch when one queue would refuse", async () => {
      stub.onCall(QUEUE, EXECUTE_EXITS, queueRefusal('QueuePaused'));

      await release([
        row({ id: '7' }),
        row({ id: '7', queueAddress: OTHER_QUEUE }),
      ]);

      expect(mockExecuteExits).toHaveBeenCalledWith(
        [{ queueAddress: OTHER_QUEUE, requestIds: ['7'] }],
        expect.any(Function),
      );
      expect(refusalText()).toContain(
        'Withdrawal #7 was not released because releases are paused.',
      );
    });
  });

  describe("the wallet's network", () => {
    // The release is signed on the wallet's chain. Sent from another chain, a
    // call to the queue's address finds no code, succeeds, and does nothing.
    it('asks the wallet itself which network it is on before releasing', async () => {
      await release([row()]);

      expect(mockWalletSend).toHaveBeenCalledWith('eth_chainId', []);
      expect(mockExecuteExit).toHaveBeenCalled();
    });

    it('reads and sends nothing when the wallet is on another network, and says so', async () => {
      mockWalletSend.mockImplementation(async (method: string) =>
        method === 'eth_chainId' ? '0x1' : null,
      );

      await release([row()]);

      expect(stub.callCount(QUEUE)).toBe(0);
      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(mockExecuteExits).not.toHaveBeenCalled();
      expect(refusalText()).toContain(
        'Your wallet is connected to another network. Switch it to Rootstock, then release again.',
      );
    });

    it('sends nothing when the wallet cannot say which network it is on, and says so', async () => {
      // How an EIP-1193 wallet rejects a request once it is disconnected.
      mockWalletSend.mockRejectedValue(
        Object.assign(
          new Error('The provider is disconnected from all chains.'),
          { code: 4900 },
        ),
      );

      await release([row()]);

      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(
        'We could not check which network your wallet is on, so nothing was released.',
      );
    });

    it('sends nothing without a connected signer to ask', async () => {
      mockSigner = undefined;

      await release([row()]);

      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(
        'We could not check which network your wallet is on',
      );
    });
  });
});
