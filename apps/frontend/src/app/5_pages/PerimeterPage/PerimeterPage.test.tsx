import { fireEvent, render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';

import { Decimal } from '@sovryn/utils';

import { i18n } from '../../../locales/i18n';
import { BlockState, ExitStatus } from '../../../utils/exitDelay';
import { PerimeterPage } from './PerimeterPage';

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const RECEIVER = '0x3333333333333333333333333333333333333333';
const QUEUE = '0x9999999999999999999999999999999999999999';

const mockExecuteExit = jest.fn();
const mockExecuteExits = jest.fn();

let mockVault: {
  queueAddress?: string;
  exits: any[];
  blocks: Record<string, any>;
  paused: boolean;
  loading: boolean;
};

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

const NOW = 1_800_000_000;

const exit = (overrides: Record<string, unknown> = {}) => ({
  id: '7',
  amount: Decimal.from(1.5),
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
    mockVault = {
      queueAddress: QUEUE,
      exits: [],
      blocks: {},
      paused: false,
      loading: false,
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
    expect(mockExecuteExit).toHaveBeenCalledWith('7', expect.any(Function));
  });

  it('withholds Release while an exit is still on hold', () => {
    mockVault.exits = [exit({ unlockAt: NOW + 3600 })];
    mockVault.blocks = { '7': clear };
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('On hold').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1 hour').length).toBeGreaterThan(0);
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
      ['7', '8'],
      expect.any(Function),
    );
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
