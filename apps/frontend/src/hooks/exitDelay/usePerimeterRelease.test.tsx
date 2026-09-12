import { act, render, renderHook } from '@testing-library/react';

import React from 'react';

import { utils } from 'ethers';
import 'jest-canvas-mock';

import { i18n } from '../../locales/i18n';
import { BlockState, exitKey } from '../../utils/exitDelay';
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

jest.mock('../useAccount', () => ({
  useAccount: () => ({ account: ACCOUNT }),
}));

jest.mock('./useExecuteExit', () => ({
  useExecuteExit: () => mockExecuteExit,
  useExecuteExits: () => mockExecuteExits,
}));

jest.mock('../../contexts/NotificationContext', () => ({
  useNotificationContext: () => ({ addNotification: mockAddNotification }),
}));

const QUEUE_ABI = new utils.Interface([
  'function blockStateOf(address a) view returns (uint8)',
]);
const BLOCK_STATE = selectorOf('blockStateOf(address)');

const stateResult = (state: number): StubAnswer => ({
  result: utils.defaultAbiCoder.encode(['uint8'], [state]),
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
    stub.onCall(QUEUE, BLOCK_STATE, stateResult(BlockState.None));
    stub.onCall(OTHER_QUEUE, BLOCK_STATE, stateResult(BlockState.None));
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
});
