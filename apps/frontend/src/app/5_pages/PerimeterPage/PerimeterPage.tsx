import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

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
import { usePerimeterHistory } from '../../../hooks/exitDelay/usePerimeterHistory';
import { usePerimeterRelease } from '../../../hooks/exitDelay/usePerimeterRelease';
import { usePerimeterVault } from '../../../hooks/exitDelay/usePerimeterVault';
import { useAccount } from '../../../hooks/useAccount';
import { useChainStore } from '../../../hooks/useChainStore';
import { useWalletConnect } from '../../../hooks/useWalletConnect';
import { translations } from '../../../locales/i18n';
import {
  canExecuteExit,
  exitKey,
  getPendingExitState,
} from '../../../utils/exitDelay';
import {
  PerimeterExitRow,
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
  const [releasedKeys, setReleasedKeys] = useState<Set<string>>(new Set());
  const markReleased = useCallback((keys: string[]) => {
    setReleasedKeys(prev => {
      const next = new Set(prev);
      keys.forEach(key => next.add(key));
      return next;
    });
  }, []);

  const release = usePerimeterRelease();

  // The live list holds only what is still waiting. What has been released
  // is read back from the chain on request, under the history switch.
  const [showHistory, setShowHistory] = useState(false);
  const history = usePerimeterHistory(showHistory, exits);

  const rows: PerimeterExitRow[] = useMemo(
    () =>
      (showHistory ? history.exits : exits)
        .filter(exit => showHistory || !releasedKeys.has(exitKey(exit)))
        .map(exit => ({
          ...exit,
          state: getPendingExitState(
            exit,
            pausedByQueue[exit.queueAddress] ?? paused,
            account,
            { now, blockTime },
          ),
        })),
    [
      account,
      blockTime,
      exits,
      history.exits,
      now,
      paused,
      pausedByQueue,
      releasedKeys,
      showHistory,
    ],
  );

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
          getTimeToRelease(row.unlockAt, now),
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
    if (showHistory) {
      return history.unknown
        ? t(translations.perimeterPage.history.unreadable)
        : t(translations.perimeterPage.history.empty);
    }
    return readFailed
      ? t(translations.perimeterPage.unreadable)
      : t(translations.perimeterPage.inactive);
  }, [account, readFailed, showHistory, history.unknown]);

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
          {paused && (
            <Paragraph
              size={ParagraphSize.small}
              className="text-center mb-4"
              dataAttribute="perimeter-paused"
            >
              {t(translations.perimeterPage.statusTooltip.paused)}
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
          {showHistory && (history.unknown || clockUnreadable) && account && (
            <Paragraph
              size={ParagraphSize.small}
              className="text-center mb-4"
              dataAttribute="perimeter-history-unreadable"
            >
              {t(translations.perimeterPage.history.unreadable)}
            </Paragraph>
          )}
          <div className="w-full max-w-5xl">
            {account && (
              <div className="flex justify-end mb-3">
                <Button
                  text={
                    showHistory
                      ? t(translations.perimeterPage.history.hide)
                      : t(translations.perimeterPage.history.show)
                  }
                  size={ButtonSize.small}
                  style={ButtonStyle.secondary}
                  onClick={() => setShowHistory(current => !current)}
                  dataAttribute="perimeter-history-toggle"
                />
              </div>
            )}
            {!showHistory && releasableRows.length > 1 && (
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
              // and the table draws whatever rows it is given even while it
              // shows its loader: a row resolved against a missing time would
              // read as on hold for decades. So no rows until the clock is
              // known, the loader while it is still coming, and the empty
              // message once its read has failed.
              rows={now ? rows : []}
              rowKey={row => exitKey(row)}
              isLoading={
                loading ||
                (showHistory && history.loading) ||
                (!!account && !now && !clockUnreadable)
              }
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
