import { fireEvent, render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';

import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { i18n } from '../../../locales/i18n';
import { ExitStatus, exitKey } from '../../../utils/exitDelay';
import { PerimeterPage } from './PerimeterPage';

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const RECEIVER = '0x3333333333333333333333333333333333333333';
const QUEUE = '0x9999999999999999999999999999999999999999';
const OTHER_QUEUE = '0x8888888888888888888888888888888888888888';

const NOT_HOLDING =
  'The Sovryn Perimeter is not holding any withdrawals for this account.';

const mockRelease = jest.fn();

let mockVault: {
  exits: any[];
  pausedByQueue: Record<string, boolean>;
  paused: boolean;
  loading: boolean;
  unknown: boolean;
};
let mockChainTime: { now: number; unreadable: boolean };
let mockCurrentChainId: string;

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

jest.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../../../contexts/NotificationContext', () => ({
  useNotificationContext: () => ({ addNotification: jest.fn() }),
}));

jest.mock('../../../hooks/useAccount', () => ({
  useAccount: () => ({ account: ACCOUNT, signer: undefined }),
}));

jest.mock('../../../hooks/exitDelay/usePerimeterVault', () => ({
  usePerimeterVault: () => mockVault,
}));

jest.mock('../../../hooks/exitDelay/usePerimeterRelease', () => ({
  usePerimeterRelease: () => mockRelease,
}));

jest.mock('../../../hooks/exitDelay/useChainTime', () => ({
  useChainTime: () => mockChainTime,
}));

jest.mock('../../../hooks/useChainStore', () => ({
  useChainStore: () => ({
    currentChainId: mockCurrentChainId,
    setCurrentChainId: jest.fn(),
  }),
}));

const NOW = 1_800_000_000;

const exit = (overrides: Record<string, unknown> = {}) => ({
  id: '7',
  queueAddress: QUEUE,
  amount: Decimal.from(1.5),
  tokenSymbol: 'BTC',
  token: '0x0000000000000000000000000000000000000000',
  createdAt: NOW - 100,
  unlockAt: NOW - 1,
  originator: ACCOUNT,
  owner: ACCOUNT,
  receiver: RECEIVER,
  surfaceId: '0x00',
  subProduct: '0x0000000000000000000000000000000000000000',
  status: ExitStatus.Queued,
  unwrapOnDelivery: false,
  ownerHasCode: false,
  ...overrides,
});

const releaseButton = (container: HTMLElement, queue: string, id: string) =>
  container.querySelector(
    `[data-layout-id="perimeter-release-${exitKey({
      queueAddress: queue,
      id,
    })}"]`,
  );

describe('PerimeterPage', () => {
  beforeAll(async () => {
    await i18n;
  });

  beforeEach(() => {
    // Re-applied per test: this project's jest config resets mocks between
    // tests, and a reset Date.now would make every row read as unlocked.
    jest.spyOn(Date, 'now').mockReturnValue(NOW * 1000);
    mockChainTime = { now: NOW, unreadable: false };
    mockCurrentChainId = RSK_CHAIN_ID;
    mockVault = {
      exits: [],
      pausedByQueue: {},
      paused: false,
      loading: false,
      unknown: false,
    };
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('says nothing is held when the queue holds nothing for this account', () => {
    render(<PerimeterPage />);
    // The table renders a desktop and a mobile variant, so the empty message
    // legitimately appears more than once.
    expect(screen.getAllByText(NOT_HOLDING).length).toBeGreaterThan(0);
  });

  it('never states nothing is held when the read failed', () => {
    // An account with queued exits produces exactly this empty list when a
    // round trip fails. Printing the definitive negative for it is the one
    // thing this page must not do.
    mockVault.unknown = true;
    const { container } = render(<PerimeterPage />);

    expect(screen.queryByText(NOT_HOLDING)).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="perimeter-unreadable"]'),
    ).toBeInTheDocument();
  });

  it('says the read failed even while it lists what it did get', () => {
    mockVault.unknown = true;
    mockVault.exits = [exit()];
    const { container } = render(<PerimeterPage />);

    expect(
      container.querySelector('[data-layout-id="perimeter-unreadable"]'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Ready').length).toBeGreaterThan(0);
  });

  it('draws no row until the chain clock has been read', () => {
    // Every status and countdown is derived from it; a row resolved against a
    // missing time reads as on hold for decades.
    mockChainTime = { now: 0, unreadable: false };
    mockVault.exits = [exit()];
    render(<PerimeterPage />);

    expect(screen.queryAllByText('#7')).toHaveLength(0);
    expect(screen.queryAllByText('On hold')).toHaveLength(0);
  });

  it('says the vault could not be read when the chain clock could not be read', () => {
    mockChainTime = { now: 0, unreadable: true };
    mockVault.exits = [exit()];
    const { container } = render(<PerimeterPage />);

    expect(
      container.querySelector('[data-layout-id="perimeter-unreadable"]'),
    ).toBeInTheDocument();
    expect(screen.queryAllByText('#7')).toHaveLength(0);
    expect(screen.queryByText(NOT_HOLDING)).not.toBeInTheDocument();
  });

  it('decides readiness from the chain clock, not the browser clock', () => {
    // A machine two minutes fast would otherwise flip a locked hold to Ready;
    // the release reverts NotUnlocked and, inside a batch, takes every other
    // ready hold with it.
    jest.spyOn(Date, 'now').mockReturnValue((NOW + 7200) * 1000);
    mockVault.exits = [exit({ unlockAt: NOW + 3600 })];
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('On hold').length).toBeGreaterThan(0);
    expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
  });

  it('names the asset an amount is denominated in', () => {
    // One queue holds every asset the perimeter covers: 1.5 RBTC and 1.5 DOC
    // are adjacent rows three orders of magnitude apart.
    mockVault.exits = [exit()];
    render(<PerimeterPage />);

    expect(screen.getAllByText(/1\.5/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/BTC/).length).toBeGreaterThan(0);
  });

  it('prints no amount for an asset it could not resolve', () => {
    mockVault.exits = [exit({ amount: undefined, tokenSymbol: undefined })];
    render(<PerimeterPage />);

    expect(screen.getAllByText('Unknown asset').length).toBeGreaterThan(0);
  });

  it('counts down to two units rather than rounding up to one', () => {
    mockVault.exits = [exit({ unlockAt: NOW + 90_000 })];
    render(<PerimeterPage />);

    expect(screen.getAllByText('1d 1h').length).toBeGreaterThan(0);
  });

  it('withholds the release controls on the wrong network', () => {
    mockCurrentChainId = '0x1';
    mockVault.exits = [exit()];
    const { container } = render(<PerimeterPage />);

    expect(container.querySelector('.pointer-events-none')).toBeInTheDocument();
    expect(screen.getAllByText(/switch/i).length).toBeGreaterThan(0);
  });

  it('offers Release on an unlocked row and hands the row to the release check', () => {
    mockVault.exits = [exit()];
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('Ready').length).toBeGreaterThan(0);
    const button = releaseButton(container, QUEUE, '7');
    expect(button).toBeInTheDocument();
    fireEvent.click(button!);

    expect(mockRelease).toHaveBeenCalledWith(
      [expect.objectContaining({ id: '7', queueAddress: QUEUE })],
      expect.any(Function),
    );
  });

  it('shows no review state for any row: a blocked party is named on release', () => {
    mockVault.exits = [exit()];
    render(<PerimeterPage />);

    expect(screen.queryByText('Under review')).not.toBeInTheDocument();
  });

  it('withholds Release while an exit is still on hold', () => {
    mockVault.exits = [exit({ unlockAt: NOW + 3600 })];
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('On hold').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1h').length).toBeGreaterThan(0);
    expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
  });

  it('withholds Release for the whole queue while releases are paused', () => {
    mockVault.exits = [exit()];
    mockVault.paused = true;
    mockVault.pausedByQueue = { [QUEUE]: true };
    const { container } = render(<PerimeterPage />);

    expect(
      container.querySelector('[data-layout-id="perimeter-paused"]'),
    ).toBeInTheDocument();
    expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
  });

  it('withholds Release from an account that is only the receiver', () => {
    mockVault.exits = [
      exit({
        originator: RECEIVER,
        owner: RECEIVER,
        receiver: ACCOUNT,
      }),
    ];
    const { container } = render(<PerimeterPage />);

    expect(
      screen.getAllByText('Releasable by the owner').length,
    ).toBeGreaterThan(0);
    expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
  });

  it('hands every ready row, and no other, to one release', () => {
    mockVault.exits = [
      exit({ id: '7' }),
      exit({ id: '8' }),
      exit({ id: '9', unlockAt: NOW + 3600 }),
    ];
    render(<PerimeterPage />);

    fireEvent.click(screen.getByText('Release all ready (2)'));

    expect(mockRelease).toHaveBeenCalledTimes(1);
    const [rows] = mockRelease.mock.calls[0];
    expect(rows.map((row: { id: string }) => row.id)).toEqual(['7', '8']);
  });

  it('drops a row once its release completes, so a later batch cannot carry it', () => {
    // executeExits is atomic on-chain: a terminal id reverts the batch and
    // takes every other ready release down with it.
    mockRelease.mockImplementation(
      (rows: { queueAddress: string; id: string }[], onReleased) =>
        onReleased(rows.map(exitKey)),
    );
    mockVault.exits = [exit({ id: '7' }), exit({ id: '8' }), exit({ id: '9' })];
    const { container } = render(<PerimeterPage />);

    expect(screen.getByText('Release all ready (3)')).toBeInTheDocument();

    fireEvent.click(releaseButton(container, QUEUE, '7')!);

    expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
    expect(screen.getByText('Release all ready (2)')).toBeInTheDocument();
  });

  it('drops every row a batch release completed', () => {
    mockRelease.mockImplementation(
      (rows: { queueAddress: string; id: string }[], onReleased) =>
        onReleased(rows.map(exitKey)),
    );
    mockVault.exits = [exit({ id: '7' }), exit({ id: '8' })];
    render(<PerimeterPage />);

    fireEvent.click(screen.getByText('Release all ready (2)'));

    expect(screen.queryByText(/Release all ready/)).not.toBeInTheDocument();
    expect(screen.getAllByText(NOT_HOLDING).length).toBeGreaterThan(0);
  });

  it('keeps two queues’ requests that share an id apart', () => {
    // Ids restart in each queue. Releasing request 7 in one queue must not
    // take request 7 of the other off the page.
    mockRelease.mockImplementation(
      (rows: { queueAddress: string; id: string }[], onReleased) =>
        onReleased(rows.map(exitKey)),
    );
    mockVault.exits = [
      exit({ id: '7', queueAddress: QUEUE }),
      exit({ id: '7', queueAddress: OTHER_QUEUE }),
    ];
    const { container } = render(<PerimeterPage />);

    expect(releaseButton(container, QUEUE, '7')).toBeInTheDocument();
    expect(releaseButton(container, OTHER_QUEUE, '7')).toBeInTheDocument();

    fireEvent.click(releaseButton(container, QUEUE, '7')!);

    expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
    expect(releaseButton(container, OTHER_QUEUE, '7')).toBeInTheDocument();
  });

  it('withholds the batch button when only one row is ready', () => {
    mockVault.exits = [
      exit({ id: '7' }),
      exit({ id: '8', unlockAt: NOW + 60 }),
    ];
    render(<PerimeterPage />);
    expect(screen.queryByText(/Release all ready/)).not.toBeInTheDocument();
  });

  it('shows the contract-owner notice on a row whose owner has code', () => {
    mockVault.exits = [exit({ ownerHasCode: true })];
    const { container } = render(<PerimeterPage />);

    expect(
      container.querySelector(
        `[data-layout-id="perimeter-contract-owner-${exitKey({
          queueAddress: QUEUE,
          id: '7',
        })}"]`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        'Held in escrow for the product you used; delivered automatically once the hold expires.',
      ).length,
    ).toBeGreaterThan(0);
  });

  it('hides the contract-owner notice on a row whose owner is a plain wallet', () => {
    mockVault.exits = [exit({ ownerHasCode: false })];
    render(<PerimeterPage />);

    expect(
      screen.queryByText(
        'Held in escrow for the product you used; delivered automatically once the hold expires.',
      ),
    ).not.toBeInTheDocument();
  });
});
