import React, { FC, useCallback, useMemo, useState } from 'react';

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
  useExecuteExit,
  useExecuteExits,
} from '../../../hooks/exitDelay/useExecuteExit';
import { usePerimeterVault } from '../../../hooks/exitDelay/usePerimeterVault';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import {
  BlockState,
  canExecuteExit,
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
  const { exits, blocks, pausedByQueue, paused, loading, unknown } =
    usePerimeterVault();

  // Chain time, not the browser's: the queue compares block.timestamp, and a
  // machine whose clock runs fast would otherwise offer a release that reverts
  // and, in a batch, revert every other release with it. Zero means the chain
  // clock has not been read, which the loader below covers.
  const now = useChainTime(RSK_CHAIN_ID);

  // Ids released in this session, held until the next block refetch drops them
  // from the vault. The queue refetches each block, but a row released one
  // moment and included in a "release all" the next would revert the whole
  // atomic batch (its status is no longer Queued). Excluding released ids until
  // the fetch catches up keeps a just-released row from poisoning a later batch.
  const [releasedIds, setReleasedIds] = useState<Set<string>>(new Set());
  const markReleased = useCallback((ids: string[]) => {
    setReleasedIds(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      return next;
    });
  }, []);

  const executeExit = useExecuteExit();
  const executeExits = useExecuteExits();

  const rows: PerimeterExitRow[] = useMemo(
    () =>
      exits
        .filter(exit => !releasedIds.has(exit.id))
        .map(exit => ({
          ...exit,
          state: getPendingExitState(
            exit,
            blocks[exit.id] ?? {
              originator: BlockState.None,
              owner: BlockState.None,
              receiver: BlockState.None,
            },
            pausedByQueue[exit.queueAddress] ?? paused,
            account,
            now,
          ),
        })),
    [account, blocks, exits, now, paused, pausedByQueue, releasedIds],
  );

  const handleRelease = useCallback(
    (row: PerimeterExitRow) =>
      executeExit(row.queueAddress, row.id, () => markReleased([row.id])),
    [executeExit, markReleased],
  );

  // The batch carries exactly the rows the per-row button would offer —
  // executeExits is atomic on-chain, so one uncertain id would revert every
  // other release with it. It is also grouped by queue, because an id belongs
  // to the queue that holds it and no other contract will accept it.
  const releasableByQueue = useMemo(() => {
    const groups: Record<string, string[]> = {};
    rows
      .filter(row => canExecuteExit(row.state))
      .forEach(row => {
        groups[row.queueAddress] = [
          ...(groups[row.queueAddress] ?? []),
          row.id,
        ];
      });
    return groups;
  }, [rows]);

  const releasableCount = useMemo(
    () =>
      Object.values(releasableByQueue).reduce(
        (total, ids) => total + ids.length,
        0,
      ),
    [releasableByQueue],
  );

  const handleReleaseAll = useCallback(
    () =>
      executeExits(
        Object.entries(releasableByQueue).map(([queueAddress, requestIds]) => ({
          queueAddress,
          requestIds,
        })),
        markReleased,
      ),
    [executeExits, markReleased, releasableByQueue],
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
                dataAttribute={`perimeter-status-${row.id}`}
              />
            </span>
            {row.ownerHasCode && (
              <Paragraph
                size={ParagraphSize.small}
                dataAttribute={`perimeter-contract-owner-${row.id}`}
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
          // Offered for exactly the one state the contract would accept; every
          // other state explains itself through the status tooltip instead of
          // a button that reverts.
          canExecuteExit(row.state) ? (
            <Button
              text={t(translations.perimeterPage.release)}
              size={ButtonSize.small}
              style={ButtonStyle.secondary}
              onClick={() => handleRelease(row)}
              dataAttribute={`perimeter-release-${row.id}`}
            />
          ) : null,
      },
    ],
    [handleRelease, now],
  );

  // "Not holding any withdrawals" is a definitive statement, and only a
  // completed read earns it. A read that failed says so instead.
  const emptyMessage = useMemo(() => {
    if (!account) {
      return t(translations.perimeterPage.connectWallet);
    }
    return unknown
      ? t(translations.perimeterPage.unreadable)
      : t(translations.perimeterPage.inactive);
  }, [account, unknown]);

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
          {unknown && account && (
            <Paragraph
              size={ParagraphSize.small}
              className="text-center mb-4"
              dataAttribute="perimeter-unreadable"
            >
              {t(translations.perimeterPage.unreadable)}
            </Paragraph>
          )}
          <div className="w-full max-w-5xl">
            {releasableCount > 1 && (
              <div className="flex justify-end mb-3">
                <Button
                  text={t(translations.perimeterPage.releaseAll, {
                    count: releasableCount,
                  })}
                  size={ButtonSize.small}
                  style={ButtonStyle.primary}
                  onClick={handleReleaseAll}
                  dataAttribute="perimeter-release-all"
                />
              </div>
            )}
            <Table
              columns={columns}
              rows={rows}
              rowKey={row => row.id}
              // Rows are withheld until the chain clock is known: every status
              // and countdown is derived from it, and a row resolved against a
              // missing time would read as locked for decades.
              isLoading={loading || (!!account && !now)}
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
