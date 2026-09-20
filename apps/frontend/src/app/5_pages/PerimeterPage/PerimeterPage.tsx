import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import {
  Button,
  ButtonSize,
  ButtonStyle,
  Heading,
  HelperButton,
  Paragraph,
  ParagraphSize,
  Table,
  Tooltip,
  TooltipTrigger,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import {
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../constants/currencies';
import { useChainTime } from '../../../hooks/exitDelay/useChainTime';
import {
  ReleaseEntry,
  usePerimeterRelease,
} from '../../../hooks/exitDelay/usePerimeterRelease';
import { usePerimeterVault } from '../../../hooks/exitDelay/usePerimeterVault';
import { useAccount } from '../../../hooks/useAccount';
import { useChainStore } from '../../../hooks/useChainStore';
import { useWalletConnect } from '../../../hooks/useWalletConnect';
import { translations } from '../../../locales/i18n';
import {
  canExecuteExit,
  exitKey,
  getPendingExitState,
  isPendingExitStatus,
} from '../../../utils/exitDelay';
import {
  PerimeterExitRow,
  clearLegacyHistoryKeys,
  getStatusLabel,
  getStatusTooltip,
  getTimeToRelease,
  shortenAddress,
} from './PerimeterPage.utils';

/** Bitcoin-denominated rows need every satoshi; everything else does not. */
const precisionFor = (symbol?: string): number =>
  symbol === 'BTC' || symbol === 'WBTC' || symbol === 'RBTC'
    ? BTC_RENDER_PRECISION
    : TOKEN_RENDER_PRECISION;

const PerimeterPage: FC = () => {
  const { account } = useAccount();
  const { exits, pausedByQueue, paused, loading, unknown } =
    usePerimeterVault();

  // Every withdrawal here lives in the RSK vault. The release checks its own
  // network at the press regardless; this only decides whether the button
  // offers itself as pressable. Wrong network is judged the same way the
  // header's own check judges it: the app's selected network, or a connected
  // wallet whose own network disagrees with it.
  const { currentChainId } = useChainStore();
  const { wallets } = useWalletConnect();
  const walletConnected = !!wallets[0]?.accounts[0]?.address;
  const wrongNetwork =
    currentChainId !== RSK_CHAIN_ID ||
    (walletConnected && wallets[0]?.chains[0]?.id !== RSK_CHAIN_ID);

  // Chain time, not the browser's: the queue compares block.timestamp, and a
  // machine whose clock runs fast would otherwise offer a release that reverts
  // and, in a batch, revert every other release with it. `now` ticks and drives
  // the countdown; `blockTime` is the latest block's own timestamp, and a row is
  // ready only once that reaches its unlock time. Zero means the chain clock has
  // not been read yet; `clockUnreadable` means it could not be.
  const {
    now,
    blockTime,
    unreadable: clockUnreadable,
  } = useChainTime(RSK_CHAIN_ID);

  // Nothing on the page is stated from a read that did not complete: neither
  // the vault's own reads nor the clock every row is judged against.
  const readFailed = unknown || clockUnreadable;

  // Withdrawals released in this session, by queue and id, held until the next
  // vault read drops them. A row released one moment and carried by a "release
  // all" the next would revert the whole atomic batch, since its status is no
  // longer Queued. Ids restart in each queue, so the queue is part of the key.
  // This is this tab's own session memory, not read from chain, so nothing
  // scopes it to an account unless this does: nothing else remounts the page
  // on an account change. Cleared the moment the connected account changes,
  // so a row released under one account is never carried into another's live
  // filtering as though it were theirs. Every read this page drives is
  // pinned to RSK_CHAIN_ID regardless of the wallet's or the app's selected
  // chain (see usePerimeterVault), so there is no equivalent chain-scoped
  // state here to reset on a chain change.
  const [releasedKeys, setReleasedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    setReleasedKeys(new Set());
  }, [account]);

  // Once, on the first mount of this page: the withdrawal history this
  // browser used to keep per device is retired, and any keys it left behind
  // in local storage are stale from here on.
  useEffect(() => {
    clearLegacyHistoryKeys();
  }, []);

  const markReleased = useCallback((entries: ReleaseEntry[]) => {
    setReleasedKeys(prev => {
      const next = new Set(prev);
      entries.forEach(({ key }) => next.add(key));
      return next;
    });
  }, []);

  const release = usePerimeterRelease();

  // What the page lists: the vault's own rows, minus this session's released
  // ones and minus any row the vault itself reports as done. A release drops
  // its row from here at once, ahead of the vault's next read, and a row the
  // vault reports with a stated status other than Queued — released by
  // another party, or resolved away by the Owner — is trusted and dropped
  // the same way the moment that read lands, rather than shown with a label
  // for what became of it. Neither kind of row ever comes back: the filter
  // is re-applied on every vault read, not just the read that first dropped
  // it. A status the vault could not state at all stays listed instead, so a
  // read failure is never mistaken for a withdrawal that already left.
  const liveExits = useMemo(
    () =>
      exits.filter(
        exit =>
          !releasedKeys.has(exitKey(exit)) && isPendingExitStatus(exit.status),
      ),
    [exits, releasedKeys],
  );

  const rows: PerimeterExitRow[] = useMemo(
    () =>
      liveExits.map(exit => ({
        ...exit,
        state: getPendingExitState(
          exit,
          pausedByQueue[exit.queueAddress] ?? paused,
          account,
          { now, blockTime },
        ),
      })),
    [account, blockTime, liveExits, now, paused, pausedByQueue],
  );

  // Whether releases are paused for what is actually listed below, rather
  // than for every queue the page happens to follow: a queue holding none of
  // this account's rows must never make the banner speak for the list. The
  // same per-row fallback the Status column uses keeps a row's own queue
  // counted even if it is missing from the map.
  const pausedStatesListed = useMemo(
    () =>
      [...new Set(rows.map(row => row.queueAddress))].map(
        queueAddress => pausedByQueue[queueAddress] ?? paused,
      ),
    [rows, pausedByQueue, paused],
  );
  const somePausedListed = pausedStatesListed.some(Boolean);
  const allPausedListed =
    pausedStatesListed.length > 0 && pausedStatesListed.every(Boolean);

  // The release checks take several round trips before the dialog opens. A
  // second release started meanwhile would replace the first one's
  // transaction list in the dialog, so every release control waits while one
  // runs, and the control that started it says it is checking. The ref stops
  // a second press that lands before the page renders again.
  const releaseRunning = useRef(false);
  const [checking, setChecking] = useState<
    { keys: string[]; all: boolean } | undefined
  >();
  const releaseChecked = useCallback(
    async (targets: PerimeterExitRow[], all: boolean) => {
      if (releaseRunning.current) {
        return;
      }
      releaseRunning.current = true;
      setChecking({ keys: targets.map(exitKey), all });
      try {
        await release(targets, markReleased);
      } finally {
        releaseRunning.current = false;
        setChecking(undefined);
      }
    },
    [markReleased, release],
  );

  const handleRelease = useCallback(
    (row: PerimeterExitRow) => releaseChecked([row], false),
    [releaseChecked],
  );

  // Release all offers exactly the rows the per-row button would. Whether each
  // one's parties are blocked is read when it is pressed, and only the rows
  // that read clear are sent.
  const releasableRows = useMemo(
    () => (now ? rows.filter(row => canExecuteExit(row.state)) : []),
    [now, rows],
  );

  const handleReleaseAll = useCallback(
    () => releaseChecked(releasableRows, true),
    [releaseChecked, releasableRows],
  );

  const columns = useMemo(
    () => [
      {
        id: 'id',
        title: t(translations.perimeterPage.table.id),
        cellRenderer: (row: PerimeterExitRow) => `#${row.id}`,
      },
      {
        id: 'amount',
        title: t(translations.perimeterPage.table.amount),
        // One queue holds every asset the perimeter covers, so a bare number
        // says nothing: 1.5 RBTC and 1.5 DOC are three orders of magnitude
        // apart. An asset whose decimals could not be resolved carries no
        // amount at all rather than one scaled by a guess.
        cellRenderer: (row: PerimeterExitRow) =>
          row.amount ? (
            <AmountRenderer
              value={row.amount}
              suffix={row.tokenSymbol}
              precision={precisionFor(row.tokenSymbol)}
            />
          ) : (
            t(translations.perimeterPage.table.unknownAsset)
          ),
      },
      {
        id: 'receiver',
        title: t(translations.perimeterPage.table.receiver),
        cellRenderer: (row: PerimeterExitRow) => shortenAddress(row.receiver),
      },
      {
        id: 'unlocks',
        title: t(translations.perimeterPage.table.unlocks),
        cellRenderer: (row: PerimeterExitRow) =>
          getTimeToRelease(row.unlockAt, now, row.state),
      },
      {
        id: 'status',
        title: t(translations.perimeterPage.table.status),
        cellRenderer: (row: PerimeterExitRow) => (
          <span className="flex flex-col gap-1">
            <span className="flex flex-row items-center gap-1 whitespace-nowrap">
              {getStatusLabel(row.state)}
              <HelperButton
                content={getStatusTooltip(row.state)}
                trigger={TooltipTrigger.click}
                dataAttribute={`perimeter-status-${exitKey(row)}`}
              />
            </span>
            {row.ownerHasCode && (
              <Paragraph
                size={ParagraphSize.small}
                dataAttribute={`perimeter-contract-owner-${exitKey(row)}`}
              >
                {t(translations.perimeterPage.contractOwnerNotice)}
              </Paragraph>
            )}
          </span>
        ),
      },
      {
        id: 'action',
        title: t(translations.perimeterPage.table.action),
        cellRenderer: (row: PerimeterExitRow) =>
          // Offered for exactly the states the contract's time, pause and
          // executor checks accept; the block check runs on the press itself.
          canExecuteExit(row.state) ? (
            <Tooltip
              disabled={!wrongNetwork}
              content={t(translations.perimeterPage.wrongNetworkTooltip)}
              dataAttribute={`perimeter-release-tooltip-${exitKey(row)}`}
              // The network banner sets pointer-events-none on everything
              // beneath it; this puts it back on the wrapper the tooltip
              // hovers, and takes it off the button itself so the hover
              // lands on the wrapper rather than being swallowed by a
              // disabled button.
              className="pointer-events-auto"
              children={
                <div>
                  <Button
                    text={
                      checking &&
                      !checking.all &&
                      checking.keys.includes(exitKey(row))
                        ? t(translations.perimeterPage.checking)
                        : t(translations.perimeterPage.release)
                    }
                    size={ButtonSize.small}
                    style={ButtonStyle.secondary}
                    disabled={wrongNetwork || !!checking}
                    className={wrongNetwork ? 'pointer-events-none' : undefined}
                    onClick={() => handleRelease(row)}
                    dataAttribute={`perimeter-release-${exitKey(row)}`}
                  />
                </div>
              }
            />
          ) : null,
      },
    ],
    [checking, handleRelease, now, wrongNetwork],
  );

  // "No delayed withdrawals" is a definitive statement, and only a
  // completed read earns it. A read that failed says so instead.
  const emptyMessage = useMemo(() => {
    if (!account) {
      return t(translations.perimeterPage.connectWallet);
    }
    return readFailed
      ? t(translations.perimeterPage.unreadable)
      : t(translations.perimeterPage.inactive);
  }, [account, readFailed]);

  return (
    <>
      <Helmet>
        <title>{t(translations.perimeterPage.meta.title)}</title>
      </Helmet>
      <div className="w-full flex flex-col items-center text-gray-10">
        {/* Releases are signed on RSK. Without this the page would offer a
            Release button on any connected chain, and a call to an address
            with no code does not revert: the wallet reports success and
            nothing is released. */}
        <NetworkBanner requiredChainId={RSK_CHAIN_ID}>
          <Heading className="text-center mb-3">
            {t(translations.perimeterPage.title)}
          </Heading>
          <Paragraph
            size={ParagraphSize.base}
            className="text-center max-w-2xl mb-6"
          >
            {t(translations.perimeterPage.subtitle)}
          </Paragraph>
          {somePausedListed && (
            <Paragraph
              size={ParagraphSize.small}
              className="text-center mb-4"
              dataAttribute="perimeter-paused"
            >
              {t(
                // Two independently pausable queues can hold this account's
                // withdrawals. Only when every queue behind a row listed
                // below is paused is it true that releases are paused across
                // the whole perimeter; otherwise the row-level status already
                // says which ones are.
                allPausedListed
                  ? translations.perimeterPage.statusTooltip.paused
                  : translations.perimeterPage.pausedPartial,
              )}
            </Paragraph>
          )}
          {readFailed && account && (
            <Paragraph
              size={ParagraphSize.small}
              className="text-center mb-4"
              dataAttribute="perimeter-unreadable"
            >
              {t(translations.perimeterPage.unreadable)}
            </Paragraph>
          )}
          <div className="w-full max-w-5xl">
            {releasableRows.length > 1 && (
              <div className="flex justify-end mb-3">
                <Tooltip
                  disabled={!wrongNetwork}
                  content={t(translations.perimeterPage.wrongNetworkTooltip)}
                  dataAttribute="perimeter-release-all-tooltip"
                  className="pointer-events-auto"
                  children={
                    <div>
                      <Button
                        text={
                          checking?.all
                            ? t(translations.perimeterPage.checking)
                            : t(translations.perimeterPage.releaseAll, {
                                count: releasableRows.length,
                              })
                        }
                        size={ButtonSize.small}
                        style={ButtonStyle.primary}
                        disabled={wrongNetwork || !!checking}
                        className={
                          wrongNetwork ? 'pointer-events-none' : undefined
                        }
                        onClick={handleReleaseAll}
                        dataAttribute="perimeter-release-all"
                      />
                    </div>
                  }
                />
              </div>
            )}
            <Table
              columns={columns}
              // Every status and countdown is derived from the chain clock,
              // and a row resolved against a missing time would read as on
              // hold for decades — so the list waits for it.
              rows={now ? rows : []}
              rowKey={row => exitKey(row)}
              isLoading={loading || (!!account && !now && !clockUnreadable)}
              noData={emptyMessage}
              dataAttribute="perimeter-vault-table"
            />
          </div>
        </NetworkBanner>
      </div>
    </>
  );
};

export default PerimeterPage;
export { PerimeterPage };
