import { render, renderHook, waitFor } from '@testing-library/react';

import React from 'react';

import { BigNumber } from 'ethers';

import { ExitStatus, PendingExit } from '../../utils/exitDelay';
import { rememberedExits } from '../../utils/exitDelayHistory';
import { usePerimeterHistory } from './usePerimeterHistory';

/**
 * The queue lists only what is still waiting, so history is whatever this
 * browser remembers seeing, read back from the chain on request. A remembered
 * id that is still waiting is not history; one that could not be read must
 * not vanish silently.
 */

const ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const ACCOUNT_TWO = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
const RECEIVER = '0x3333333333333333333333333333333333333333';
const QUEUE = '0x1111111111111111111111111111111111111111';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const CHAIN = '0x1e';

let mockAccount: string | undefined = ACCOUNT;
const mockGetRequest = jest.fn();

jest.mock('ethers', () => {
  const actual = jest.requireActual('ethers');
  return {
    ...actual,
    Contract: function (address: string) {
      return {
        getRequest: (id: string) => mockGetRequest(address, id),
      };
    },
  };
});

jest.mock('@sovryn/ethers-provider', () => ({
  ...jest.requireActual('@sovryn/ethers-provider'),
  getProvider: () => ({}),
}));

jest.mock('../../config/chains', () => ({
  RSK_CHAIN_ID: '0x1e',
}));

jest.mock('../useAccount', () => ({
  useAccount: () => ({ account: mockAccount }),
}));

// Short enough that the hung-read test below does not wait ten real seconds.
jest.mock('../../utils/exitDelay', () => ({
  ...jest.requireActual('../../utils/exitDelay'),
  RELEASE_READ_TIMEOUT_MS: 50,
}));

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
  status: ExitStatus.Executed,
  unwrapOnDelivery: false,
  ...overrides,
});

const live = (...ids: string[]): PendingExit[] =>
  ids.map(id => ({
    id,
    queueAddress: QUEUE,
    token: ZERO_ADDRESS,
    createdAt: 1_800_000_000,
    unlockAt: 1_800_086_400,
    originator: ACCOUNT,
    owner: ACCOUNT,
    receiver: RECEIVER,
    surfaceId: '0x00',
    subProduct: ZERO_ADDRESS,
    status: ExitStatus.Queued,
    unwrapOnDelivery: false,
  }));

const settled = async (enabled: boolean, shown: PendingExit[]) => {
  const hook = renderHook(
    ({ on, rows }: { on: boolean; rows: PendingExit[] }) =>
      usePerimeterHistory(on, rows),
    { initialProps: { on: enabled, rows: shown } },
  );
  await waitFor(() => expect(hook.result.current.loading).toBe(false));
  return hook;
};

describe('usePerimeterHistory', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockAccount = ACCOUNT;
    mockGetRequest.mockResolvedValue(request());
  });

  it('remembers every live withdrawal it is shown, for this chain and account', async () => {
    await settled(false, live('7', '8'));

    expect(rememberedExits(CHAIN, ACCOUNT)).toEqual([
      { queueAddress: QUEUE, id: '7' },
      { queueAddress: QUEUE, id: '8' },
    ]);
  });

  it('reads nothing from the chain while history is not asked for', async () => {
    const hook = await settled(false, live('7'));

    expect(hook.result.current.exits).toEqual([]);
    expect(mockGetRequest).not.toHaveBeenCalled();
  });

  it('reads back the remembered withdrawals that are no longer waiting, newest first', async () => {
    const { rerender, result } = await settled(false, live('7', '8', '9'));
    mockGetRequest.mockImplementation(async (_queue: string, id: string) =>
      request({
        unlockAt: BigNumber.from(1_800_000_000 + Number(id)),
        status: id === '7' ? ExitStatus.Executed : ExitStatus.ResolvedByOwner,
      }),
    );

    rerender({ on: true, rows: live('9') });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.exits).toHaveLength(2));

    expect(result.current.exits.map(exit => exit.id)).toEqual(['8', '7']);
    expect(result.current.exits.map(exit => exit.status)).toEqual([
      ExitStatus.ResolvedByOwner,
      ExitStatus.Executed,
    ]);
    const read = mockGetRequest.mock.calls.map(([, id]) => id);
    expect(read).not.toContain('9');
  });

  it('leaves a remembered withdrawal that is still waiting out of history', async () => {
    const { rerender, result } = await settled(false, live('7', '8'));
    mockGetRequest.mockImplementation(async (_queue: string, id: string) =>
      request({ status: id === '7' ? ExitStatus.Queued : ExitStatus.Executed }),
    );

    rerender({ on: true, rows: [] });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.exits).toHaveLength(1));

    expect(result.current.exits[0].id).toBe('8');
    expect(result.current.exits[0].status).toBe(ExitStatus.Executed);
    expect(result.current.exits[0].amount?.toString()).toBe('1.5');
    expect(result.current.unknown).toBe(false);
  });

  it('reports a withdrawal it could not read as unknown, never as absent', async () => {
    const { rerender, result } = await settled(false, live('7', '8'));
    mockGetRequest.mockImplementation(async (_queue: string, id: string) => {
      if (id === '7') throw new Error('rpc down');
      return request();
    });

    rerender({ on: true, rows: [] });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.exits).toHaveLength(1));

    expect(result.current.exits[0].id).toBe('8');
    expect(result.current.unknown).toBe(true);
  });

  it('reports a remembered withdrawal the queue no longer holds as unknown, not as nothing remembered', async () => {
    // A remembered id was seen queued in this same queue, so a node reporting
    // no such request means the node does not hold it, not that it never
    // existed. The release path already treats status None this way.
    const { rerender, result } = await settled(false, live('7', '8'));
    mockGetRequest.mockImplementation(async (_queue: string, id: string) =>
      request({ status: id === '7' ? ExitStatus.None : ExitStatus.Executed }),
    );

    rerender({ on: true, rows: [] });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.exits).toHaveLength(1));

    expect(result.current.exits[0].id).toBe('8');
    expect(result.current.unknown).toBe(true);
  });

  it('reports a remembered withdrawal with a status outside the five the queue defines as unknown', async () => {
    const { rerender, result } = await settled(false, live('7', '8'));
    mockGetRequest.mockImplementation(async (_queue: string, id: string) =>
      request({ status: id === '7' ? 9 : ExitStatus.Executed }),
    );

    rerender({ on: true, rows: [] });
    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.exits).toHaveLength(1));

    expect(result.current.exits[0].id).toBe('8');
    expect(result.current.unknown).toBe(true);
  });

  it('gives up on a read that never answers, and reports the history as unknown', async () => {
    const { rerender, result } = await settled(false, live('7'));
    mockGetRequest.mockReturnValue(new Promise(() => undefined));

    rerender({ on: true, rows: [] });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.exits).toEqual([]);
    expect(result.current.unknown).toBe(true);
  });

  it('is empty without a wallet, and remembers nothing', async () => {
    mockAccount = undefined;

    const hook = await settled(true, live('7'));

    expect(hook.result.current).toEqual({
      exits: [],
      loading: false,
      unknown: false,
    });
    expect(window.localStorage.length).toBe(0);
  });

  it('clears the previous account’s rows on the very first render after the account changes, ahead of the read for the new one', async () => {
    // Every value usePerimeterHistory ever returns, in render order, so the
    // render produced immediately after the account changes — before the
    // read effect for the new account has run — can be inspected on its own,
    // rather than only the value left once everything has settled.
    const renders: ReturnType<typeof usePerimeterHistory>[] = [];
    const Probe = ({ on, rows }: { on: boolean; rows: PendingExit[] }) => {
      renders.push(usePerimeterHistory(on, rows));
      return null;
    };

    const { rerender } = render(
      React.createElement(Probe, { on: false, rows: live('7', '8', '9') }),
    );
    await waitFor(() =>
      expect(renders[renders.length - 1].loading).toBe(false),
    );

    mockGetRequest.mockImplementation(async (_queue: string, id: string) =>
      request({
        unlockAt: BigNumber.from(1_800_000_000 + Number(id)),
        status: id === '7' ? ExitStatus.Executed : ExitStatus.ResolvedByOwner,
      }),
    );
    rerender(React.createElement(Probe, { on: true, rows: live('9') }));
    await waitFor(() =>
      expect(renders[renders.length - 1].loading).toBe(false),
    );
    expect(renders[renders.length - 1].exits.map(exit => exit.id)).toEqual([
      '8',
      '7',
    ]);

    renders.length = 0;
    mockAccount = ACCOUNT_TWO;
    rerender(React.createElement(Probe, { on: true, rows: live('9') }));

    expect(renders[0].exits).toEqual([]);

    await waitFor(() =>
      expect(renders[renders.length - 1].loading).toBe(false),
    );
    expect(renders[renders.length - 1].exits).toEqual([]);
  });
});
