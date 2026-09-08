import { fireEvent, render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';

import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { i18n } from '../../../locales/i18n';
import { BlockState, ExitStatus } from '../../../utils/exitDelay';
import { PerimeterPage } from './PerimeterPage';

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const RECEIVER = '0x3333333333333333333333333333333333333333';
const QUEUE = '0x9999999999999999999999999999999999999999';

const mockExecuteExit = jest.fn();
const mockExecuteExits = jest.fn();

let mockVault: {
  exits: any[];
  blocks: Record<string, any>;
  pausedByQueue: Record<string, boolean>;
  paused: boolean;
  loading: boolean;
  unknown: boolean;
};
let mockChainTime: number;
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

jest.mock('../../../hooks/exitDelay/useExecuteExit', () => ({
  useExecuteExit: () => mockExecuteExit,
  useExecuteExits: () => mockExecuteExits,
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
  ...overrides,
});

const clear = {
  originator: BlockState.None,
  owner: BlockState.None,
  receiver: BlockState.None,
};

describe('PerimeterPage', () => {
  beforeAll(async () => {
    await i18n;
  });

  beforeEach(() => {
    // Re-applied per test: this project's jest config resets mocks between
    // tests, and a reset Date.now would make every row read as unlocked.
    jest.spyOn(Date, 'now').mockReturnValue(NOW * 1000);
    mockExecuteExit.mockClear();
    mockExecuteExits.mockClear();
    mockChainTime = NOW;
    mockCurrentChainId = RSK_CHAIN_ID;
    mockVault = {
      exits: [],
      blocks: {},
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
    expect(
      screen.getAllByText(
        'The Sovryn Perimeter is not holding any withdrawals for this account.',
      ).length,
    ).toBeGreaterThan(0);
  });

  it('never states nothing is held when the read failed', () => {
    // An account with queued exits produces exactly this empty list when a
    // round trip fails. Printing the definitive negative for it is the one
    // thing this page must not do.
    mockVault.unknown = true;
    const { container } = render(<PerimeterPage />);

    expect(
      screen.queryByText(
        'The Sovryn Perimeter is not holding any withdrawals for this account.',
      ),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="perimeter-unreadable"]'),
    ).toBeInTheDocument();
  });

  it('says the read failed even while it lists what it did get', () => {
    mockVault.unknown = true;
    mockVault.exits = [exit()];
    mockVault.blocks = { '7': clear };
    const { container } = render(<PerimeterPage />);

    expect(
      container.querySelector('[data-layout-id="perimeter-unreadable"]'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Ready').length).toBeGreaterThan(0);
  });

  it('withholds the rows until the chain clock has been read', () => {
    // Every status and countdown is derived from it; a row resolved against a
    // missing time would read as locked for decades.
    mockChainTime = 0;
    mockVault.exits = [exit()];
    mockVault.blocks = { '7': clear };
    const { container } = render(<PerimeterPage />);

    expect(
      container.querySelector('[data-layout-id="perimeter-release-7"]'),
    ).not.toBeInTheDocument();
  });

  it('decides readiness from the chain clock, not the browser clock', () => {
    // A machine two minutes fast would otherwise flip a locked hold to Ready;
    // the release reverts NotUnlocked and, inside a batch, takes every other
    // ready hold with it.
    jest.spyOn(Date, 'now').mockReturnValue((NOW + 7200) * 1000);
    mockVault.exits = [exit({ unlockAt: NOW + 3600 })];
    mockVault.blocks = { '7': clear };
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('On hold').length).toBeGreaterThan(0);
    expect(
      container.querySelector('[data-layout-id="perimeter-release-7"]'),
    ).not.toBeInTheDocument();
  });

  it('names the asset an amount is denominated in', () => {
    // One queue holds every asset the perimeter covers: 1.5 RBTC and 1.5 DOC
    // are adjacent rows three orders of magnitude apart.
    mockVault.exits = [exit()];
    mockVault.blocks = { '7': clear };
    render(<PerimeterPage />);

    expect(screen.getAllByText(/1\.5/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/BTC/).length).toBeGreaterThan(0);
  });

  it('prints no amount for an asset it could not resolve', () => {
    mockVault.exits = [exit({ amount: undefined, tokenSymbol: undefined })];
    mockVault.blocks = { '7': clear };
    render(<PerimeterPage />);

    expect(screen.getAllByText('Unknown asset').length).toBeGreaterThan(0);
  });

  it('counts down to two units rather than rounding up to one', () => {
    mockVault.exits = [exit({ unlockAt: NOW + 90_000 })];
    mockVault.blocks = { '7': clear };
    render(<PerimeterPage />);

    expect(screen.getAllByText('1d 1h').length).toBeGreaterThan(0);
  });

  it('withholds the release controls on the wrong network', () => {
    // A call to an address with no code does not revert: on most chains the
    // wallet reports success and nothing is released.
    mockCurrentChainId = '0x1';
    mockVault.exits = [exit()];
    mockVault.blocks = { '7': clear };
    const { container } = render(<PerimeterPage />);

    expect(container.querySelector('.pointer-events-none')).toBeInTheDocument();
    expect(screen.getAllByText(/switch/i).length).toBeGreaterThan(0);
  });

  it('offers Release for an unlocked exit this account can execute', () => {
    mockVault.exits = [exit()];
    mockVault.blocks = { '7': clear };
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('Ready').length).toBeGreaterThan(0);
    const button = container.querySelector(
      '[data-layout-id="perimeter-release-7"]',
    );
    expect(button).toBeInTheDocument();
    fireEvent.click(button!);
    expect(mockExecuteExit).toHaveBeenCalledWith(
      QUEUE,
      '7',
      expect.any(Function),
    );
  });

  it('withholds Release while an exit is still on hold', () => {
    mockVault.exits = [exit({ unlockAt: NOW + 3600 })];
    mockVault.blocks = { '7': clear };
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('On hold').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1h').length).toBeGreaterThan(0);
    expect(
      container.querySelector('[data-layout-id="perimeter-release-7"]'),
    ).not.toBeInTheDocument();
  });

  it('withholds Release when a party is blocked, and says why', () => {
    mockVault.exits = [exit()];
    mockVault.blocks = { '7': { ...clear, receiver: BlockState.Frozen } };
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('Under review').length).toBeGreaterThan(0);
    expect(
      container.querySelector('[data-layout-id="perimeter-release-7"]'),
    ).not.toBeInTheDocument();
  });

  it('withholds Release for the whole queue while releases are paused', () => {
    mockVault.exits = [exit()];
    mockVault.blocks = { '7': clear };
    mockVault.paused = true;
    mockVault.pausedByQueue = { [QUEUE]: true };
    const { container } = render(<PerimeterPage />);

    expect(
      container.querySelector('[data-layout-id="perimeter-paused"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="perimeter-release-7"]'),
    ).not.toBeInTheDocument();
  });

  it('withholds Release from an account that is only the receiver', () => {
    mockVault.exits = [
      exit({
        originator: RECEIVER,
        owner: RECEIVER,
        receiver: ACCOUNT,
      }),
    ];
    mockVault.blocks = { '7': clear };
    const { container } = render(<PerimeterPage />);

    expect(
      screen.getAllByText('Releasable by the owner').length,
    ).toBeGreaterThan(0);
    expect(
      container.querySelector('[data-layout-id="perimeter-release-7"]'),
    ).not.toBeInTheDocument();
  });

  it('offers one batch release for exactly the certainly-succeeding rows', () => {
    mockVault.exits = [
      exit({ id: '7' }),
      exit({ id: '8' }),
      exit({ id: '9', unlockAt: NOW + 3600 }),
    ];
    render(<PerimeterPage />);
    const all = screen.getByText('Release all ready (2)');
    fireEvent.click(all);
    expect(mockExecuteExits).toHaveBeenCalledWith(
      [{ queueAddress: QUEUE, requestIds: ['7', '8'] }],
      expect.any(Function),
    );
  });

  it('drops a just-released row so a later batch cannot carry it', () => {
    // executeExits is atomic on-chain: a terminal id reverts the batch and
    // takes every other ready release down with it. The page therefore has to
    // forget a row the moment its release is signed, ahead of the refetch —
    // which only works if the callback it passes actually reaches the hook.
    mockExecuteExit.mockImplementation(
      (_queue: string, _id: string, onComplete?: () => void) => onComplete?.(),
    );
    mockVault.exits = [exit({ id: '7' }), exit({ id: '8' }), exit({ id: '9' })];
    const { container } = render(<PerimeterPage />);

    expect(screen.getByText('Release all ready (3)')).toBeInTheDocument();

    fireEvent.click(
      container.querySelector('[data-layout-id="perimeter-release-7"]')!,
    );

    expect(
      container.querySelector('[data-layout-id="perimeter-release-7"]'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Release all ready (2)')).toBeInTheDocument();
  });

  it('drops every id a batch release settled', () => {
    mockExecuteExits.mockImplementation(
      (
        batches: { requestIds: string[] }[],
        onComplete?: (ids: string[]) => void,
      ) => onComplete?.(batches.flatMap(batch => batch.requestIds)),
    );
    mockVault.exits = [exit({ id: '7' }), exit({ id: '8' })];
    render(<PerimeterPage />);

    fireEvent.click(screen.getByText('Release all ready (2)'));

    expect(screen.queryByText(/Release all ready/)).not.toBeInTheDocument();
    expect(
      screen.getAllByText(
        'The Sovryn Perimeter is not holding any withdrawals for this account.',
      ).length,
    ).toBeGreaterThan(0);
  });

  it('withholds the batch button when only one row is ready', () => {
    mockVault.exits = [
      exit({ id: '7' }),
      exit({ id: '8', unlockAt: NOW + 60 }),
    ];
    render(<PerimeterPage />);
    expect(screen.queryByText(/Release all ready/)).not.toBeInTheDocument();
  });
});
