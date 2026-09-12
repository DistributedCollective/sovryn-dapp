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

// Each chain read the checks make gives up after this bound; short here so a
// read that never returns ends a test in about a second.
jest.mock('../../utils/exitDelay', () => ({
  ...jest.requireActual('../../utils/exitDelay'),
  RELEASE_READ_TIMEOUT_MS: 1_000,
}));

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

/** What a release hands the transaction dialog besides the ids: its completion callback and its check inside the send step. */
const SEND_OPTIONS = expect.objectContaining({
  onComplete: expect.any(Function),
  preflight: expect.any(Function),
});

/** The node's gas estimate for a release: 50,000. */
const GAS_ESTIMATE: StubAnswer = { result: '0xc350' };

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
    // The wallet is on RSK and signs as the account the page shows, unless a
    // test says otherwise.
    mockWalletSend.mockImplementation(async (method: string) => {
      if (method === 'eth_chainId') {
        return '0x1e';
      }
      return method === 'eth_accounts' ? [ACCOUNT] : null;
    });
    mockSigner = { provider: { send: mockWalletSend } };
    // Every request is still queued, every party clear, and the queue accepts
    // every dry run, unless a test says otherwise.
    [QUEUE, OTHER_QUEUE].forEach(queue => {
      stub.onCall(queue, BLOCK_STATE, stateResult(BlockState.None));
      stub.onCall(queue, GET_REQUEST, requestResult(ExitStatus.Queued));
      stub.onCall(queue, EXECUTE_EXIT, { result: '0x' });
      stub.onCall(queue, EXECUTE_EXITS, { result: '0x' });
    });
    stub.onMethod('eth_estimateGas', GAS_ESTIMATE);
    // The queue address carries code unless a test says otherwise.
    stub.onMethod('eth_getCode', { result: '0x6080604052' });
  });

  afterEach(() => stub.reset());

  afterAll(() => stub.close());

  const blockOn = (queue: string, party: string, answer: StubAnswer) =>
    stub.onCall(
      queue,
      QUEUE_ABI.encodeFunctionData('blockStateOf', [party]),
      answer,
    );

  const statusOf = (queue: string, id: number, answer: StubAnswer) =>
    stub.onCall(
      queue,
      QUEUE_ABI.encodeFunctionData('getRequest', [id]),
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

  /**
   * Run the check a release handed to the transaction dialog, the way the
   * dialog runs it when the holder presses Confirm: inside the send step,
   * immediately before the wallet is asked to sign, with the gas limit the
   * holder typed in the dialog's Advanced settings, if any.
   */
  const confirmInDialog = (typedGasLimit?: string): Promise<unknown> => {
    const [single] = mockExecuteExit.mock.calls;
    if (single) {
      const [queueAddress, id, { preflight }] = single;
      return preflight({ queueAddress, requestIds: [id] }, typedGasLimit);
    }
    const [batches, { preflight }] = mockExecuteExits.mock.calls[0];
    return preflight(batches[0], typedGasLimit);
  };

  /** What the latest refusal notice says, as the holder reads it. */
  const refusalText = () => {
    const { calls } = mockAddNotification.mock;
    const notification = calls[calls.length - 1]?.[0];
    if (!notification) {
      return '';
    }
    const { container } = render(<>{notification.content}</>);
    return container.textContent ?? '';
  };

  it('sends a release whose parties all read unblocked', async () => {
    mockExecuteExit.mockImplementation(
      async (
        _queue: string,
        _id: string,
        { onComplete }: { onComplete: () => void },
      ) => onComplete(),
    );

    const onReleased = await release([row()]);

    expect(mockExecuteExit).toHaveBeenCalledWith(QUEUE, '7', SEND_OPTIONS);
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
      SEND_OPTIONS,
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
        { onComplete }: { onComplete: (batch: unknown) => void },
      ) => batches.forEach(batch => onComplete(batch)),
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
      SEND_OPTIONS,
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
        SEND_OPTIONS,
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

    it('drops a withdrawal the queue refuses by id, says why, and still sends the rest', async () => {
      stub.onCall(
        QUEUE,
        QUEUE_ABI.encodeFunctionData('executeExits', [[7, 8, 9]]),
        queueRefusal('AlreadyTerminal', [8]),
      );

      await release([row({ id: '7' }), row({ id: '8' }), row({ id: '9' })]);

      expect(mockExecuteExits).toHaveBeenCalledWith(
        [{ queueAddress: QUEUE, requestIds: ['7', '9'] }],
        SEND_OPTIONS,
      );
      expect(refusalText()).toContain(
        'Withdrawal #8 was not released because #8 was already delivered.',
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
        SEND_OPTIONS,
      );
      expect(refusalText()).toContain(
        'Withdrawal #7 was not released because releases are paused.',
      );
    });
  });

  describe('a node that does not answer', () => {
    // A read that never returns ends in a refusal saying what could not be
    // checked, not in a Release that stays checking for minutes.
    it('gives up on a status read, and says it could not check whether the withdrawal is still waiting', async () => {
      statusOf(QUEUE, 7, { hang: true });

      await release([row()]);

      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(
        'Withdrawal #7 was not released because we could not check whether it is still waiting.',
      );
    });

    it('gives up on a block state read, and says it could not check the addresses', async () => {
      blockOn(QUEUE, RECEIVER, { hang: true });

      await release([row()]);

      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(
        'Withdrawal #7 was not released because we could not check whether its addresses are frozen or blacklisted.',
      );
    });

    it.each([
      [
        'the code at the queue address',
        () => stub.onMethod('eth_getCode', { hang: true }),
      ],
      ['a dry run', () => stub.onCall(QUEUE, EXECUTE_EXIT, { hang: true })],
    ])(
      'gives up on %s, and says it could not check whether the release would go through',
      async (_case, hang) => {
        hang();

        await release([row()]);

        expect(mockExecuteExit).not.toHaveBeenCalled();
        expect(refusalText()).toContain(
          'Withdrawal #7 was not released because we could not check whether it would go through.',
        );
      },
    );

    it('gives up on a gas estimate when the holder confirms, and sends nothing', async () => {
      await release([row()]);
      stub.onMethod('eth_estimateGas', { hang: true });

      await expect(confirmInDialog()).rejects.toThrow();
      expect(refusalText()).toContain(
        'Withdrawal #7 was not released because we could not estimate the gas it needs',
      );
    });
  });

  describe('the queue it asks', () => {
    // A call to an address with no code executes nothing and returns empty
    // data, which is also what an accepted release returns. The dry run takes
    // a yes only from an address with code, and only as the empty result a
    // release gives.
    const UNCHECKED =
      'Withdrawal #7 was not released because we could not check whether it would go through.';

    it('does not take a yes from an address with no code: sends nothing, and says it could not check', async () => {
      stub.onMethod('eth_getCode', { result: '0x' });

      await release([row()]);

      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(UNCHECKED);
    });

    it('sends nothing when the code at the queue address could not be read, and says so', async () => {
      stub.onMethod('eth_getCode', { status: 503, body: 'unavailable' });

      await release([row()]);

      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(UNCHECKED);
    });

    it('does not take a result a release never returns as a yes', async () => {
      stub.onCall(QUEUE, EXECUTE_EXIT, { result: `0x${'00'.repeat(32)}` });

      await release([row()]);

      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(UNCHECKED);
    });

    it('checks the code at the queue address again when the holder confirms', async () => {
      await release([row()]);
      stub.onMethod('eth_getCode', { result: '0x' });

      await expect(confirmInDialog()).rejects.toThrow();
      expect(refusalText()).toContain(UNCHECKED);
    });
  });

  describe('a status other than queued', () => {
    // Only a withdrawal paid to its receiver has been delivered. A request the
    // answering node does not hold reads as status None, which says nothing
    // about the withdrawal. The two recovery outcomes paid it elsewhere, and
    // the holder is told what happened to it.
    const UNREAD =
      'Withdrawal #7 was not released because we could not check whether it is still waiting.';
    const TO_PROTOCOL =
      'cannot be released: it was returned to the protocol because the address that started it or the position owner was blacklisted.';
    const BY_OWNER =
      'cannot be released: the owner of the Sovryn Perimeter sent it to another destination.';

    it('keeps a row whose status the node reports as unknown, sends nothing, and says it could not check', async () => {
      statusOf(QUEUE, 7, requestResult(ExitStatus.None));

      const onReleased = await release([row()]);

      expect(onReleased).not.toHaveBeenCalled();
      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(UNREAD);
    });

    it('keeps a row whose status is outside the known values, sends nothing, and says it could not check', async () => {
      statusOf(QUEUE, 7, requestResult(9 as ExitStatus));

      const onReleased = await release([row()]);

      expect(onReleased).not.toHaveBeenCalled();
      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(UNREAD);
    });

    it.each([
      ['returned to the protocol', ExitStatus.ResolvedToProtocol, TO_PROTOCOL],
      ['sent elsewhere by the owner', ExitStatus.ResolvedBySIP, BY_OWNER],
    ])(
      'takes a withdrawal %s off the page, says what happened to it, and sends the rest',
      async (_case, status, line) => {
        statusOf(QUEUE, 8, requestResult(status));

        const onReleased = await release([row({ id: '7' }), row({ id: '8' })]);

        expect(onReleased).toHaveBeenCalledWith([
          exitKey({ queueAddress: QUEUE, id: '8' }),
        ]);
        expect(mockExecuteExit).toHaveBeenCalledWith(QUEUE, '7', SEND_OPTIONS);
        expect(refusalText()).toContain(`Withdrawal #8 ${line}`);
      },
    );

    it('keeps a row the node reports as unknown when the holder confirms, and sends nothing', async () => {
      const onReleased = await release([row()]);
      statusOf(QUEUE, 7, requestResult(ExitStatus.None));

      await expect(confirmInDialog()).rejects.toThrow();
      expect(onReleased).not.toHaveBeenCalled();
      expect(refusalText()).toContain(UNREAD);
    });

    it('takes a withdrawal the owner sent elsewhere off the page when the holder confirms, and says so', async () => {
      const onReleased = await release([row()]);
      statusOf(QUEUE, 7, requestResult(ExitStatus.ResolvedBySIP));

      await expect(confirmInDialog()).rejects.toThrow();
      expect(onReleased).toHaveBeenCalledWith([
        exitKey({ queueAddress: QUEUE, id: '7' }),
      ]);
      expect(refusalText()).toContain(`Withdrawal #7 ${BY_OWNER}`);
      expect(refusalText()).not.toContain('already delivered');
    });
  });

  describe('a withdrawal still unlocking', () => {
    // The dry run executes against the latest block, whose timestamp trails
    // wall time by up to about a minute on RSK mainnet. A withdrawal the queue
    // refuses as not yet unlocked is named as unlocking, and a batch sends the
    // rest rather than failing whole.
    const refuseAsLocked = (ids: number[], lockedId: number) =>
      stub.onCall(
        QUEUE,
        QUEUE_ABI.encodeFunctionData('executeExits', [ids]),
        queueRefusal('NotUnlocked', [lockedId, 1_800_000_000]),
      );

    it('says a withdrawal is unlocking and to try again in a minute, and sends nothing for it', async () => {
      stub.onCall(
        QUEUE,
        EXECUTE_EXIT,
        queueRefusal('NotUnlocked', [7, 1_800_000_000]),
      );

      await release([row()]);

      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(
        'Withdrawal #7 is unlocking — try again in a minute.',
      );
      expect(refusalText()).not.toContain('was not released');
    });

    it('drops the withdrawals still unlocking from a batch, names them, and sends the rest', async () => {
      refuseAsLocked([7, 8, 9], 8);
      refuseAsLocked([7, 9], 9);

      await release([row({ id: '7' }), row({ id: '8' }), row({ id: '9' })]);

      expect(mockExecuteExits).toHaveBeenCalledWith(
        [{ queueAddress: QUEUE, requestIds: ['7'] }],
        SEND_OPTIONS,
      );
      expect(refusalText()).toContain(
        'Withdrawals #8, #9 are unlocking — try again in a minute.',
      );
    });

    it('drops a withdrawal still unlocking when the holder confirms, names it, and sends the rest', async () => {
      await release([row({ id: '7' }), row({ id: '9' })]);
      refuseAsLocked([7, 9], 9);

      await expect(confirmInDialog()).resolves.toEqual({
        requestIds: ['7'],
        gasLimit: '60000',
        from: ACCOUNT,
      });
      expect(refusalText()).toContain(
        'Withdrawal #9 is unlocking — try again in a minute.',
      );
    });
  });

  describe('the gas limit it is sent with', () => {
    // The node estimates 50,000 for the state the check just read, and the
    // release is mined in a later block. It is sent with 20% above that
    // estimate, or with a gas limit the holder typed in the dialog's Advanced
    // settings when that limit covers the estimate.
    it('sends with 20% above the fresh estimate when the holder typed no gas limit', async () => {
      await release([row()]);

      await expect(confirmInDialog()).resolves.toEqual({
        requestIds: ['7'],
        gasLimit: '60000',
        from: ACCOUNT,
      });
    });

    it.each([
      ['at', '50000'],
      ['above', '75000'],
    ])(
      'keeps a gas limit typed in Advanced settings %s the fresh estimate',
      async (_case, typed) => {
        await release([row()]);

        await expect(confirmInDialog(typed)).resolves.toEqual({
          requestIds: ['7'],
          gasLimit: typed,
          from: ACCOUNT,
        });
        expect(mockAddNotification).not.toHaveBeenCalled();
      },
    );

    it('sends nothing when a gas limit typed in Advanced settings is below the fresh estimate, and says the limit is too low', async () => {
      await release([row()]);

      await expect(confirmInDialog('40000')).rejects.toThrow();
      expect(refusalText()).toContain(
        'Withdrawal #7 was not released because the gas limit set in Advanced settings is too low: 40000 is below the 50000 it needs.',
      );
    });
  });

  describe('at the moment of sending', () => {
    // The holder may press Confirm in the transaction dialog long after
    // Release. The same check runs again inside the send step, immediately
    // before the wallet is asked to sign: only what still passes is sent, with
    // a gas limit set from a fresh estimate for exactly that, and never with a
    // guessed gas limit.
    const estimates = () => stub.requestsFor('eth_estimateGas');

    it('checks again on Confirm, and sends with a gas limit set from the estimate for what it sends', async () => {
      await release([row({ id: '7' }), row({ id: '9' })]);

      await expect(confirmInDialog()).resolves.toEqual({
        requestIds: ['7', '9'],
        gasLimit: '60000',
        from: ACCOUNT,
      });
      expect(stub.callsTo(QUEUE, EXECUTE_EXITS)).toHaveLength(2);
      expect(estimates()).toEqual([
        [
          expect.objectContaining({
            from: ACCOUNT,
            to: QUEUE,
            data: QUEUE_ABI.encodeFunctionData('executeExits', [[7, 9]]),
          }),
        ],
      ]);
    });

    it('drops a withdrawal whose party is blocked by the time the holder confirms, says which and why, and sends the rest', async () => {
      await release([
        row({ id: '7' }),
        row({ id: '8', receiver: OTHER_RECEIVER }),
        row({ id: '9' }),
      ]);
      blockOn(QUEUE, OTHER_RECEIVER, stateResult(BlockState.Frozen));

      await expect(confirmInDialog()).resolves.toEqual({
        requestIds: ['7', '9'],
        gasLimit: '60000',
        from: ACCOUNT,
      });
      expect(refusalText()).toContain(
        'Withdrawal #8 was not released because the receiver is frozen.',
      );
      expect(estimates()).toEqual([
        [
          expect.objectContaining({
            data: QUEUE_ABI.encodeFunctionData('executeExits', [[7, 9]]),
          }),
        ],
      ]);
    });

    it('drops a withdrawal the queue refuses by id at the moment of sending, says why, and sends the rest', async () => {
      await release([row({ id: '7' }), row({ id: '8' }), row({ id: '9' })]);
      stub.onCall(
        QUEUE,
        QUEUE_ABI.encodeFunctionData('executeExits', [[7, 8, 9]]),
        queueRefusal('AlreadyTerminal', [8]),
      );

      await expect(confirmInDialog()).resolves.toEqual({
        requestIds: ['7', '9'],
        gasLimit: '60000',
        from: ACCOUNT,
      });
      expect(refusalText()).toContain(
        'Withdrawal #8 was not released because #8 was already delivered.',
      );
    });

    it('sends nothing when the queue is paused by the time the holder confirms, and says so', async () => {
      await release([row({ id: '7' }), row({ id: '9' })]);
      stub.onCall(QUEUE, EXECUTE_EXITS, queueRefusal('QueuePaused'));

      await expect(confirmInDialog()).rejects.toThrow();
      expect(refusalText()).toContain(
        'Withdrawals #7, #9 were not released because releases are paused.',
      );
      expect(estimates()).toHaveLength(0);
    });

    it('sends nothing for a withdrawal someone else delivers before the holder confirms, takes it off the page, and says why', async () => {
      const onReleased = await release([row()]);
      statusOf(QUEUE, 7, requestResult(ExitStatus.Executed));

      await expect(confirmInDialog()).rejects.toThrow();
      expect(onReleased).toHaveBeenCalledWith([
        exitKey({ queueAddress: QUEUE, id: '7' }),
      ]);
      expect(refusalText()).toContain(
        'Withdrawal #7 was not released because #7 was already delivered.',
      );
    });

    it.each([
      ['the node does not answer', { status: 503, body: 'unavailable' }],
      [
        'the node reports that the estimate reverted',
        {
          error: {
            code: -32015,
            message: 'VM Exception while processing transaction: revert',
            data: '0x',
          },
        },
      ],
    ])(
      'never sends on a guessed gas limit: when %s, nothing is sent, and it says so',
      async (_case, answer) => {
        await release([row()]);
        stub.onMethod('eth_estimateGas', answer as StubAnswer);

        await expect(confirmInDialog()).rejects.toThrow();
        expect(refusalText()).toContain(
          'Withdrawal #7 was not released because we could not estimate the gas it needs, and a release is never sent on a guess.',
        );
      },
    );

    it('sends nothing when the wallet is on another network by the time the holder confirms, and says so', async () => {
      await release([row()]);
      mockWalletSend.mockImplementation(async (method: string) =>
        method === 'eth_chainId' ? '0x1' : null,
      );

      await expect(confirmInDialog()).rejects.toThrow();
      expect(refusalText()).toContain(
        'Your wallet is connected to another network. Switch it to Rootstock, then release again.',
      );
      expect(estimates()).toHaveLength(0);
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

  describe("the wallet's account", () => {
    // The checks ask about the account the page shows, but the wallet signs as
    // whichever account is active in it at that moment, and a release from an
    // account that is neither the originator nor the owner reverts. So the
    // wallet's own answer is compared with that account at the press, when the
    // send step starts, and as the last read before the wallet is asked to sign.
    const ACCOUNT_CHANGED =
      'Your wallet switched to a different account, so nothing was sent. Switch back to the account these withdrawals belong to, then release again.';

    /** The wallet answers `eth_accounts` with each list in turn, then the last one. */
    const accountsInTurn = (...answers: string[][]) =>
      mockWalletSend.mockImplementation(async (method: string) => {
        if (method === 'eth_chainId') {
          return '0x1e';
        }
        if (method !== 'eth_accounts') {
          return null;
        }
        return answers.length > 1 ? answers.shift() : answers[0];
      });

    it('asks the wallet itself which account it signs as before releasing', async () => {
      await release([row()]);

      expect(mockWalletSend).toHaveBeenCalledWith('eth_accounts', []);
      expect(mockExecuteExit).toHaveBeenCalled();
    });

    it('reads and sends nothing when the wallet signs as another account than the page shows, and says so', async () => {
      accountsInTurn([OTHER]);

      await release([row()]);

      expect(stub.callCount(QUEUE)).toBe(0);
      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(mockExecuteExits).not.toHaveBeenCalled();
      expect(refusalText()).toContain(ACCOUNT_CHANGED);
    });

    it('sends nothing when the wallet switches account before the holder confirms, and says so', async () => {
      await release([row()]);
      accountsInTurn([OTHER]);

      await expect(confirmInDialog()).rejects.toThrow();
      expect(refusalText()).toContain(ACCOUNT_CHANGED);
      expect(stub.requestsFor('eth_estimateGas')).toHaveLength(0);
    });

    it('sends nothing when the wallet switches account while the check inside the send step runs, and says so', async () => {
      await release([row({ id: '7' }), row({ id: '9' })]);
      accountsInTurn([ACCOUNT], [OTHER]);

      await expect(confirmInDialog()).rejects.toThrow();
      expect(refusalText()).toContain(ACCOUNT_CHANGED);
    });

    it('sends nothing when the wallet cannot say which account it signs as, and says so', async () => {
      // How an EIP-1193 wallet refuses a method the site is not authorised for.
      mockWalletSend.mockImplementation(async (method: string) => {
        if (method === 'eth_chainId') {
          return '0x1e';
        }
        throw Object.assign(
          new Error(
            'The requested method has not been authorized by the user.',
          ),
          { code: 4100 },
        );
      });

      await release([row()]);

      expect(mockExecuteExit).not.toHaveBeenCalled();
      expect(refusalText()).toContain(
        'We could not check which account your wallet is using, so nothing was released.',
      );
    });

    it('names the account the checks ran for as the one to send from', async () => {
      await release([row()]);

      await expect(confirmInDialog()).resolves.toEqual(
        expect.objectContaining({ from: ACCOUNT }),
      );
    });
  });
});
