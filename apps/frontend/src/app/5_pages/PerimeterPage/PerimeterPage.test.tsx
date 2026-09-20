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
let mockCurrentChainId: string;
let mockWallets: {
  chains: { id: string }[];
  accounts: { address: string }[];
}[];

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

jest.mock('../../../hooks/exitDelay/useChainTime', () => ({
  useChainTime: () => mockChainTime,
}));

jest.mock('../../../hooks/useChainStore', () => ({
  useChainStore: () => ({
    currentChainId: mockCurrentChainId,
    setCurrentChainId: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useWalletConnect', () => ({
  useWalletConnect: () => ({ wallets: mockWallets }),
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

/** What a genuinely completed release hands `onReleased` for each row. */
const asExecuted = (rows: { queueAddress: string; id: string }[]) =>
  rows.map(row => ({ key: exitKey(row), status: ExitStatus.Executed }));

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
    mockWallets = [];
    mockVault = {
      exits: [],
      pausedByQueue: {},
      paused: false,
      loading: false,
      unknown: false,
    };
    window.localStorage.clear();
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

  it('shows no release time for a row it could not read a status for', () => {
    // unlockAt sits in the past, so the Releases column would otherwise read
    // "Now" for a row nothing is released from.
    mockVault.exits = [exit({ id: '5', status: ExitStatus.None })];
    render(<PerimeterPage />);

    expect(screen.getAllByText('Could not be read').length).toBeGreaterThan(0);
    expect(screen.queryByText('Now')).not.toBeInTheDocument();
  });

  it.each([
    ['delivered', ExitStatus.Executed],
    ['resolved by the Owner', ExitStatus.ResolvedByOwner],
    ['returned to the product', ExitStatus.ResolvedToProtocol],
  ])(
    // A withdrawal the vault itself reports %s is done: the pending list is
    // for what is still waiting, so the row is dropped rather than shown
    // with a label for what became of it.
    'drops a row the vault reports as %s, rather than showing it with a resolved label',
    (_case, status) => {
      mockVault.exits = [exit({ id: '4', status })];
      render(<PerimeterPage />);

      expect(screen.queryByText('#4')).not.toBeInTheDocument();
      expect(screen.getAllByText(NO_DELAYED).length).toBeGreaterThan(0);
    },
  );

  it('lists a frozen or blacklisted row untouched — still Queued, so still pending — while dropping a genuinely resolved one alongside it', () => {
    mockVault.exits = [
      exit({ id: '6', blockedState: 1 }),
      exit({ id: '4', status: ExitStatus.ResolvedByOwner }),
    ];
    render(<PerimeterPage />);

    expect(screen.getAllByText('#6').length).toBeGreaterThan(0);
    expect(screen.queryByText('#4')).not.toBeInTheDocument();
  });

  it('renders no History UI: no toggle, and no history-only status line', () => {
    mockVault.exits = [exit()];
    const { container } = render(<PerimeterPage />);

    expect(screen.queryByText('Show history')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Show waiting withdrawals'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="perimeter-history-toggle"]'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-layout-id="perimeter-history-unreadable"]',
      ),
    ).not.toBeInTheDocument();
  });

  it('clears local-storage keys under the perimeter-history prefix on load, leaving unrelated keys alone', () => {
    window.localStorage.setItem(
      'perimeter/history/0x1e/0x1111111111111111111111111111111111111111',
      JSON.stringify([{ queueAddress: QUEUE, id: '7' }]),
    );
    window.localStorage.setItem('unrelated-key', 'keep me');

    render(<PerimeterPage />);

    expect(
      window.localStorage.getItem(
        'perimeter/history/0x1e/0x1111111111111111111111111111111111111111',
      ),
    ).toBeNull();
    expect(window.localStorage.getItem('unrelated-key')).toBe('keep me');
  });

  it.each([
    ['as the position owner', {}],
    [
      'as the receiver',
      { originator: RECEIVER, owner: RECEIVER, receiver: ACCOUNT },
    ],
  ])(
    'a row resolved by the Owner disappears on the next read, without any action on this page, for the connected account %s',
    (_case, overrides) => {
      mockVault.exits = [exit({ id: '7', ...overrides })];
      const { container, rerender } = render(<PerimeterPage />);

      expect(screen.getAllByText('#7').length).toBeGreaterThan(0);
      expect(releaseButton(container, QUEUE, '7')).toBeInTheDocument();

      // Nothing was pressed on this page: the vault's own next read is what
      // reports the withdrawal as resolved.
      mockVault.exits = [
        exit({ id: '7', ...overrides, status: ExitStatus.ResolvedByOwner }),
      ];
      rerender(<PerimeterPage />);

      expect(screen.queryByText('#7')).not.toBeInTheDocument();
      expect(screen.getAllByText(NO_DELAYED).length).toBeGreaterThan(0);
    },
  );

  it.each([
    ['as the position owner', {}],
    [
      'as the receiver',
      { originator: RECEIVER, owner: RECEIVER, receiver: ACCOUNT },
    ],
  ])(
    'a released row disappears at once and does not reappear when a stale chain read still lists it, for the connected account %s',
    (_case, overrides) => {
      mockRelease.mockImplementation(
        (rows: { queueAddress: string; id: string }[], onReleased) =>
          onReleased(asExecuted(rows)),
      );
      const row = exit({ id: '7', ...overrides });
      mockVault.exits = [row];
      const { container, rerender } = render(<PerimeterPage />);

      fireEvent.click(releaseButton(container, QUEUE, '7')!);

      expect(screen.queryByText('#7')).not.toBeInTheDocument();

      // The vault has not caught up yet: its own list still carries the row,
      // still Queued, exactly as it read before the release. The page must
      // not trust that stale read over what it already knows happened.
      mockVault.exits = [row];
      rerender(<PerimeterPage />);

      expect(screen.queryByText('#7')).not.toBeInTheDocument();
      expect(screen.getAllByText(NO_DELAYED).length).toBeGreaterThan(0);
    },
  );

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

  it('disables Release and Release all when the wallet itself is on another network, even though the app is on Rootstock', () => {
    mockWallets = [
      { chains: [{ id: '0x1' }], accounts: [{ address: ACCOUNT }] },
    ];
    mockVault.exits = [exit({ id: '7' }), exit({ id: '8' })];
    const { container } = render(<PerimeterPage />);

    expect(releaseButton(container, QUEUE, '7')).toBeDisabled();
    expect(
      container.querySelector('[data-layout-id="perimeter-release-all"]'),
    ).toBeDisabled();
  });

  it('leaves Release enabled when the wallet is disconnected but the app is on Rootstock', () => {
    mockWallets = [];
    mockVault.exits = [exit({ id: '7' })];
    const { container } = render(<PerimeterPage />);

    expect(releaseButton(container, QUEUE, '7')).toBeEnabled();
  });

  it('lets a wrong-network tooltip be hovered under the network banner', () => {
    // pointer-events-none from the banner would otherwise starve the wrapper
    // of hover, so it is put back explicitly; jsdom applies none of the
    // Tailwind classes, so this pins the class rather than real hover.
    mockCurrentChainId = '0x1';
    mockVault.exits = [exit({ id: '7' }), exit({ id: '8' })];
    const { container } = render(<PerimeterPage />);

    const buttonTooltip = container.querySelector(
      `[data-layout-id="perimeter-release-tooltip-${exitKey({
        queueAddress: QUEUE,
        id: '7',
      })}"]`,
    );
    expect(buttonTooltip).toHaveClass('pointer-events-auto');

    const allTooltip = container.querySelector(
      '[data-layout-id="perimeter-release-all-tooltip"]',
    );
    expect(allTooltip).toHaveClass('pointer-events-auto');
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

  it('never reads a zero-filled record as a withdrawal that was paid out', () => {
    // A zero-filled record — the answering node does not hold it — reads as
    // unreadable, not as a fact about the withdrawal.
    mockVault.exits = [exit({ status: ExitStatus.None })];
    mockVault.unknown = true;
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('Could not be read').length).toBeGreaterThan(0);
    expect(
      container.querySelector('[data-layout-id="perimeter-unreadable"]'),
    ).toBeInTheDocument();
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

  it("shows a blacklisted party's row as ready", () => {
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

  it('drops the session’s released-row filtering when the connected account changes, so a row still live for the new account is not hidden by a key the old one released', () => {
    // releasedKeys is this browser tab's own session state, not read from
    // chain, so nothing scopes it to an account unless this effect does:
    // nothing else remounts the page on an account change.
    const OTHER_ACCOUNT = '0x2222222222222222222222222222222222222222';
    mockRelease.mockImplementation(
      (rows: { queueAddress: string; id: string }[], onReleased) =>
        onReleased(asExecuted(rows)),
    );
    mockVault.exits = [exit({ id: '7' })];
    const { container, rerender } = render(<PerimeterPage />);

    fireEvent.click(releaseButton(container, QUEUE, '7')!);
    expect(screen.queryByText('#7')).not.toBeInTheDocument();

    // The row itself is still account A's in this mock, and switching to B
    // must not carry A's released-key filtering over: a row that is
    // genuinely live for B would otherwise be hidden by a key A released.
    mockAccount = OTHER_ACCOUNT;
    rerender(<PerimeterPage />);

    expect(screen.getAllByText('#7').length).toBeGreaterThan(0);
  });

  it('withholds Release while an exit is still on hold', () => {
    mockVault.exits = [exit({ unlockAt: NOW + 3600 })];
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('Delayed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1h').length).toBeGreaterThan(0);
    expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
  });

  it('withholds Release for the whole queue while releases are paused, but keeps the held withdrawal listed', () => {
    // Pausing disables withdrawing, not seeing: the row and its own Paused
    // status must stay on the page, not just the banner saying releases are
    // paused.
    mockVault.exits = [exit()];
    mockVault.paused = true;
    mockVault.pausedByQueue = { [QUEUE]: true };
    const { container } = render(<PerimeterPage />);

    expect(
      container.querySelector('[data-layout-id="perimeter-paused"]'),
    ).toBeInTheDocument();
    expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
    expect(screen.getAllByText('#7').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Paused').length).toBeGreaterThan(0);
  });

  it('says releases are paused for some withdrawals, not the whole perimeter, when only one of two queues is paused', () => {
    mockVault.exits = [
      exit({ id: '7', queueAddress: QUEUE }),
      exit({ id: '9', queueAddress: OTHER_QUEUE }),
    ];
    mockVault.paused = true;
    mockVault.pausedByQueue = { [QUEUE]: true, [OTHER_QUEUE]: false };
    const { container } = render(<PerimeterPage />);

    expect(
      screen.queryByText(/paused across the whole perimeter/i),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="perimeter-paused"]'),
    ).toBeInTheDocument();
    expect(releaseButton(container, QUEUE, '7')).not.toBeInTheDocument();
    expect(releaseButton(container, OTHER_QUEUE, '9')).toBeInTheDocument();
  });

  it('prints no paused paragraph when the only paused queue holds none of this account’s rows', () => {
    // The account never used the paused queue, so nothing it is shown is
    // affected: the banner must be judged against what is listed, not
    // against every queue the page happens to follow.
    mockVault.exits = [exit({ id: '7', queueAddress: QUEUE })];
    mockVault.paused = true;
    mockVault.pausedByQueue = { [QUEUE]: false, [OTHER_QUEUE]: true };
    const { container } = render(<PerimeterPage />);

    expect(
      container.querySelector('[data-layout-id="perimeter-paused"]'),
    ).not.toBeInTheDocument();
    expect(releaseButton(container, QUEUE, '7')).toBeInTheDocument();
  });

  it('tells the row itself is paused, not the whole perimeter, when its status tooltip is opened', () => {
    mockVault.exits = [
      exit({ id: '7', queueAddress: QUEUE }),
      exit({ id: '9', queueAddress: OTHER_QUEUE }),
    ];
    mockVault.paused = true;
    mockVault.pausedByQueue = { [QUEUE]: true, [OTHER_QUEUE]: false };
    const { container } = render(<PerimeterPage />);

    const helper = container.querySelector(
      `[data-layout-id="perimeter-status-${exitKey({
        queueAddress: QUEUE,
        id: '7',
      })}"]`,
    );
    fireEvent.click(helper!);

    expect(
      screen.queryByText(/paused across the whole perimeter/i),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/paused for this withdrawal/i)).toBeInTheDocument();
  });

  it('offers Release to an account that is only the receiver, and presses through to it', () => {
    const row = exit({
      originator: RECEIVER,
      owner: RECEIVER,
      receiver: ACCOUNT,
    });
    mockVault.exits = [row];
    const { container } = render(<PerimeterPage />);

    expect(screen.getAllByText('Ready').length).toBeGreaterThan(0);
    const button = releaseButton(container, QUEUE, '7');
    expect(button).toBeInTheDocument();

    fireEvent.click(button!);

    expect(mockRelease).toHaveBeenCalledTimes(1);
    const [rows] = mockRelease.mock.calls[0];
    expect(rows).toEqual([expect.objectContaining({ id: '7' })]);
  });

  it('withholds Release from an account that is neither party nor receiver', () => {
    const STRANGER = '0x4444444444444444444444444444444444444444';
    mockVault.exits = [
      exit({
        originator: RECEIVER,
        owner: RECEIVER,
        receiver: STRANGER,
      }),
    ];
    const { container } = render(<PerimeterPage />);

    expect(
      screen.getAllByText('Releasable by the position owner').length,
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
        onReleased(asExecuted(rows)),
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
        onReleased(asExecuted(rows)),
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
        onReleased(asExecuted(rows)),
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
