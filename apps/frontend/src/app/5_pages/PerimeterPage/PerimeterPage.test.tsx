import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

const NO_DELAYED =
  'The Sovryn Perimeter has no delayed withdrawals for this account.';

const UNREADABLE =
  /Any withdrawal delayed for this account is still in the vault/;

const mockRelease = jest.fn();

let mockVault: {
  exits: any[];
  pausedByQueue: Record<string, boolean>;
  paused: boolean;
  loading: boolean;
  unknown: boolean;
};
let mockChainTime: { now: number; blockTime: number; unreadable: boolean };
const mockHistory = jest.fn();
let mockCurrentChainId: string;

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

jest.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../../../contexts/NotificationContext', () => ({
  useNotificationContext: () => ({ addNotification: jest.fn() }),
}));

let mockAccount: string | undefined;

jest.mock('../../../hooks/useAccount', () => ({
  useAccount: () => ({ account: mockAccount, signer: undefined }),
}));

jest.mock('../../../hooks/exitDelay/usePerimeterVault', () => ({
  usePerimeterVault: () => mockVault,
}));

jest.mock('../../../hooks/exitDelay/usePerimeterRelease', () => ({
  usePerimeterRelease: () => mockRelease,
}));

jest.mock('../../../hooks/exitDelay/usePerimeterHistory', () => ({
  usePerimeterHistory: (enabled: boolean, live: unknown[]) =>
    mockHistory(enabled, live),
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
    mockAccount = ACCOUNT;
    mockChainTime = { now: NOW, blockTime: NOW, unreadable: false };
    mockCurrentChainId = RSK_CHAIN_ID;
    mockVault = {
      exits: [],
      pausedByQueue: {},
      paused: false,
      loading: false,
      unknown: false,
    };
    mockHistory.mockReturnValue({ exits: [], loading: false, unknown: false });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('asks for a wallet to show delayed withdrawals when none is connected', () => {
    mockAccount = undefined;
    render(<PerimeterPage />);

    expect(
      screen.getAllByText(
        'Connect your wallet to see your delayed withdrawals.',
      ).length,
    ).toBeGreaterThan(0);
  });

  it('says there are no delayed withdrawals when the queue has none for this account', () => {
    render(<PerimeterPage />);
    // The table renders a desktop and a mobile variant, so the empty message
    // legitimately appears more than once.
    expect(screen.getAllByText(NO_DELAYED).length).toBeGreaterThan(0);
  });

  it('never states there are no delayed withdrawals when the read failed', () => {
    // An account with queued exits produces exactly this empty list when a
    // round trip fails. Printing the definitive negative for it is the one
    // thing this page must not do.
    mockVault.unknown = true;
    const { container } = render(<PerimeterPage />);

    expect(screen.queryByText(NO_DELAYED)).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="perimeter-unreadable"]'),
    ).toBeInTheDocument();
    expect(screen.getAllByText(UNREADABLE).length).toBeGreaterThan(0);
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
    // missing time reads as delayed for decades.
    mockChainTime = { now: 0, blockTime: 0, unreadable: false };
    mockVault.exits = [exit()];
    render(<PerimeterPage />);

    expect(screen.queryAllByText('#7')).toHaveLength(0);
    expect(screen.queryAllByText('Delayed')).toHaveLength(0);
  });

  it('says the vault could not be read when the chain clock could not be read', () => {
    mockChainTime = { now: 0, blockTime: 0, unreadable: true };
    mockVault.exits = [exit()];
    const { container } = render(<PerimeterPage />);

    expect(
      container.querySelector('[data-layout-id="perimeter-unreadable"]'),
    ).toBeInTheDocument();
    expect(screen.queryAllByText('#7')).toHaveLength(0);
    expect(screen.queryByText(NO_DELAYED)).not.toBeInTheDocument();
  });

  it('decides readiness from the chain clock, not the browser clock', () => {
    // A machine two minutes fast would otherwise flip a locked hold to Ready;
    // the release reverts NotUnlocked and, inside a batch, takes every other
    // ready hold with it.
    jest.spyOn(Date, 'now').mockReturnValue((NOW + 7200) * 1000);
    mockVault.exits = [exit({ unlockAt: NOW + 3600 })];
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('Delayed').length).toBeGreaterThan(0);
    expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
  });

  describe('a row whose delay has ended on the page clock but not yet in the latest block', () => {
    // The queue compares the latest block's timestamp, which trails wall time
    // by up to about a minute on RSK mainnet. A row offered as Ready before
    // that block arrives is refused, so it reads as unlocking until then.
    it('shows it as Unlocking, offers no Release on it, and leaves it out of Release all', () => {
      mockChainTime = { now: NOW, blockTime: NOW - 30, unreadable: false };
      mockVault.exits = [
        exit({ id: '7', unlockAt: NOW - 60 }),
        exit({ id: '8', unlockAt: NOW - 1 }),
        exit({ id: '9', unlockAt: NOW - 45 }),
      ];
      const { container } = render(<PerimeterPage />);

      expect(screen.getAllByText('Unlocking').length).toBeGreaterThan(0);
      expect(releaseButton(container, QUEUE, '8')).not.toBeInTheDocument();
      expect(releaseButton(container, QUEUE, '7')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Release all ready (2)'));

      const [rows] = mockRelease.mock.calls[0];
      expect(rows.map((row: { id: string }) => row.id)).toEqual(['7', '9']);
    });

    it('offers Release once the latest block reaches the unlock time', () => {
      mockChainTime = { now: NOW + 30, blockTime: NOW, unreadable: false };
      mockVault.exits = [exit({ unlockAt: NOW })];
      const { container } = render(<PerimeterPage />);

      expect(screen.getAllByText('Ready').length).toBeGreaterThan(0);
      expect(releaseButton(container, QUEUE, '7')).toBeInTheDocument();
    });
  });

  describe('while a release is being checked', () => {
    // The checks before the dialog opens take several round trips. A second
    // press meanwhile would start a second release whose transaction list
    // replaces the first one's in the dialog, so every release control waits
    // until the checks finish, and the pressed one says it is checking.
    const releaseThatWaits = () => {
      let finish: () => void = () => undefined;
      mockRelease.mockImplementation(
        () =>
          new Promise<void>(resolve => {
            finish = resolve;
          }),
      );
      return () => finish();
    };

    const releaseAllButton = (container: HTMLElement) =>
      container.querySelector('[data-layout-id="perimeter-release-all"]');

    it('says Checking… on the pressed Release, and takes no other press until the checks finish', async () => {
      const finish = releaseThatWaits();
      mockVault.exits = [exit({ id: '7' }), exit({ id: '8' })];
      const { container } = render(<PerimeterPage />);

      fireEvent.click(releaseButton(container, QUEUE, '7')!);

      expect(releaseButton(container, QUEUE, '7')).toHaveTextContent(
        'Checking…',
      );
      expect(releaseButton(container, QUEUE, '7')).toBeDisabled();
      expect(releaseButton(container, QUEUE, '8')).toHaveTextContent('Release');
      expect(releaseButton(container, QUEUE, '8')).toBeDisabled();
      expect(releaseAllButton(container)).toBeDisabled();
      fireEvent.click(releaseButton(container, QUEUE, '7')!);
      fireEvent.click(releaseButton(container, QUEUE, '8')!);
      fireEvent.click(releaseAllButton(container)!);
      expect(mockRelease).toHaveBeenCalledTimes(1);

      await act(async () => finish());

      expect(releaseButton(container, QUEUE, '7')).toHaveTextContent('Release');
      expect(releaseButton(container, QUEUE, '7')).not.toBeDisabled();
      expect(releaseAllButton(container)).not.toBeDisabled();
    });

    it('says Checking… on Release all, and takes no other press until the checks finish', async () => {
      const finish = releaseThatWaits();
      mockVault.exits = [exit({ id: '7' }), exit({ id: '8' })];
      const { container } = render(<PerimeterPage />);

      fireEvent.click(releaseAllButton(container)!);

      expect(releaseAllButton(container)).toHaveTextContent('Checking…');
      expect(releaseAllButton(container)).toBeDisabled();
      expect(releaseButton(container, QUEUE, '7')).toBeDisabled();
      fireEvent.click(releaseButton(container, QUEUE, '7')!);
      fireEvent.click(releaseAllButton(container)!);
      expect(mockRelease).toHaveBeenCalledTimes(1);

      await act(async () => finish());

      expect(releaseAllButton(container)).toHaveTextContent(
        'Release all ready (2)',
      );
      expect(releaseAllButton(container)).not.toBeDisabled();
    });
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

  it('disables Release and Release all with a wrong-network tooltip when the wallet is on another network', () => {
    mockCurrentChainId = '0x1';
    mockVault.exits = [exit({ id: '7' }), exit({ id: '8' })];
    const { container } = render(<PerimeterPage />);

    const button = releaseButton(container, QUEUE, '7');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    const buttonTooltip = container.querySelector(
      `[data-layout-id="perimeter-release-tooltip-${exitKey({
        queueAddress: QUEUE,
        id: '7',
      })}"]`,
    );
    userEvent.hover(buttonTooltip!);
    expect(screen.getAllByText('wrong network').length).toBeGreaterThan(0);

    const allButton = container.querySelector(
      '[data-layout-id="perimeter-release-all"]',
    );
    expect(allButton).toBeInTheDocument();
    expect(allButton).toBeDisabled();

    const allTooltip = container.querySelector(
      '[data-layout-id="perimeter-release-all-tooltip"]',
    );
    userEvent.hover(allTooltip!);
    expect(screen.getAllByText('wrong network').length).toBeGreaterThan(1);
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

  it('shows an unlocked row with a frozen party as under investigation, with no Release', () => {
    mockVault.exits = [exit({ blockedState: 1 })];
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('Under investigation').length).toBeGreaterThan(
      0,
    );
    expect(screen.queryByText('Ready')).not.toBeInTheDocument();
    expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
    expect(screen.queryByText(/frozen/i)).not.toBeInTheDocument();
  });

  it('keeps a frozen party silent while the delay still runs', () => {
    mockVault.exits = [exit({ blockedState: 1, unlockAt: NOW + 3600 })];
    render(<PerimeterPage />);

    expect(screen.queryByText('Under investigation')).not.toBeInTheDocument();
    expect(screen.getAllByText('Delayed').length).toBeGreaterThan(0);
  });

  it('shows a blacklisted party as ready and says nothing about the block', () => {
    // The block is checked on the press, and the refusal names no party.
    mockVault.exits = [exit({ blockedState: 2 })];
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('Ready').length).toBeGreaterThan(0);
    expect(releaseButton(container, QUEUE, '7')).toBeInTheDocument();
    expect(screen.queryByText(/blacklist/i)).not.toBeInTheDocument();
  });

  it('marks a contract-owned row as held by the product, and offers no Release on it', () => {
    mockVault.exits = [
      exit({ owner: RECEIVER, originator: RECEIVER, ownerHasCode: true }),
    ];
    const { container } = render(<PerimeterPage />);

    expect(
      screen.getByText(
        'Owned by a contract: the product you used holds this withdrawal.',
      ),
    ).toBeInTheDocument();
    expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
  });

  describe('history', () => {
    it('lists only waiting withdrawals until history is asked for, and hands the live list to be remembered', () => {
      mockVault.exits = [exit({ id: '7' })];
      mockHistory.mockReturnValue({
        exits: [exit({ id: '5', status: ExitStatus.Executed })],
        loading: false,
        unknown: false,
      });
      render(<PerimeterPage />);

      expect(screen.getByText('Show history')).toBeInTheDocument();
      expect(screen.queryByText('Settled')).not.toBeInTheDocument();
      expect(screen.getAllByText('Ready').length).toBeGreaterThan(0);
      const [enabled, live] = mockHistory.mock.calls[0];
      expect(enabled).toBe(false);
      expect(live.map((row: { id: string }) => row.id)).toEqual(['7']);
    });

    it('swaps the list for the remembered, settled withdrawals when history is shown', () => {
      mockVault.exits = [exit({ id: '7' }), exit({ id: '8' })];
      mockHistory.mockImplementation((enabled: boolean) => ({
        exits: enabled
          ? [
              exit({ id: '5', status: ExitStatus.Executed }),
              exit({ id: '4', status: ExitStatus.ResolvedByOwner }),
            ]
          : [],
        loading: false,
        unknown: false,
      }));
      const { container } = render(<PerimeterPage />);

      expect(screen.getByText('Release all ready (2)')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Show history'));

      expect(screen.getByText('Show waiting withdrawals')).toBeInTheDocument();
      expect(screen.getAllByText('Settled')).toHaveLength(2);
      expect(screen.queryByText('Ready')).not.toBeInTheDocument();
      expect(screen.queryByText(/Release all ready/)).not.toBeInTheDocument();
      expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
      expect(releaseButton(container, QUEUE, '5')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Show waiting withdrawals'));

      expect(screen.getByText('Release all ready (2)')).toBeInTheDocument();
      expect(screen.queryByText('Settled')).not.toBeInTheDocument();
    });

    it('says nothing is remembered on this device when history is empty', () => {
      render(<PerimeterPage />);

      fireEvent.click(screen.getByText('Show history'));

      expect(
        screen.getAllByText(
          /No released withdrawals are remembered on this device/,
        ).length,
      ).toBeGreaterThan(0);
    });

    it('says the remembered withdrawals could not be read rather than that there are none', () => {
      mockHistory.mockImplementation((enabled: boolean) => ({
        exits: [],
        loading: false,
        unknown: enabled,
      }));
      render(<PerimeterPage />);

      fireEvent.click(screen.getByText('Show history'));

      expect(
        screen.getAllByText(/could not read the remembered withdrawals/).length,
      ).toBeGreaterThan(0);
      expect(
        screen.queryByText(/No released withdrawals are remembered/),
      ).not.toBeInTheDocument();
    });

    it('offers no history switch without a wallet', () => {
      mockAccount = undefined;
      render(<PerimeterPage />);

      expect(screen.queryByText('Show history')).not.toBeInTheDocument();
    });
  });

  it('withholds Release while an exit is still on hold', () => {
    mockVault.exits = [exit({ unlockAt: NOW + 3600 })];
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('Delayed').length).toBeGreaterThan(0);
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
    expect(screen.getAllByText(NO_DELAYED).length).toBeGreaterThan(0);
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
        'Owned by a contract: the product you used holds this withdrawal.',
      ).length,
    ).toBeGreaterThan(0);
  });

  it('hides the contract-owner notice on a row whose owner is a plain wallet', () => {
    mockVault.exits = [exit({ ownerHasCode: false })];
    render(<PerimeterPage />);

    expect(
      screen.queryByText(
        'Owned by a contract: the product you used holds this withdrawal.',
      ),
    ).not.toBeInTheDocument();
  });
});
