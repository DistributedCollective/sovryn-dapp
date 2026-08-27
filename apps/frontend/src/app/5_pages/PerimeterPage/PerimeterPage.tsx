import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

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

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
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

/** Countdown resolution. Holds are minutes at least, so a second is ample. */
const TICK_MS = 1_000;

const PerimeterPage: FC = () => {
  const { account } = useAccount();
  const { queueAddress, exits, blocks, paused, loading } = usePerimeterVault();

  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const timer = setInterval(
      () => setNow(Math.floor(Date.now() / 1000)),
      TICK_MS,
    );
    return () => clearInterval(timer);
  }, []);

  const executeExit = useExecuteExit(queueAddress);
  const executeExits = useExecuteExits(queueAddress);

  const rows: PerimeterExitRow[] = useMemo(
    () =>
      exits.map(exit => ({
        ...exit,
        state: getPendingExitState(
          exit,
          blocks[exit.id] ?? {
            originator: BlockState.None,
            owner: BlockState.None,
            receiver: BlockState.None,
          },
          paused,
          account,
          now,
        ),
      })),
    [account, blocks, exits, now, paused],
  );

  const handleRelease = useCallback(
    (row: PerimeterExitRow) => executeExit(row.id),
    [executeExit],
  );

  // The batch carries exactly the rows the per-row button would offer —
  // executeExits is atomic on-chain, so one uncertain id would revert every
  // other release with it.
  const releasableIds = useMemo(
    () => rows.filter(row => canExecuteExit(row.state)).map(row => row.id),
    [rows],
  );

  const handleReleaseAll = useCallback(
    () => executeExits(releasableIds),
    [executeExits, releasableIds],
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
        cellRenderer: (row: PerimeterExitRow) => (
          <AmountRenderer value={row.amount} />
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
          <span className="flex flex-row items-center gap-1 whitespace-nowrap">
            {getStatusLabel(row.state)}
            <HelperButton
              content={getStatusTooltip(row.state)}
              trigger={TooltipTrigger.click}
              dataAttribute={`perimeter-status-${row.id}`}
            />
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

  const emptyMessage = account
    ? t(translations.perimeterPage.inactive)
    : t(translations.perimeterPage.connectWallet);

  return (
    <>
      <Helmet>
        <title>{t(translations.perimeterPage.meta.title)}</title>
      </Helmet>
      <div className="w-full flex flex-col items-center text-gray-10">
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
        <div className="w-full max-w-5xl">
          {releasableIds.length > 1 && (
            <div className="flex justify-end mb-3">
              <Button
                text={t(translations.perimeterPage.releaseAll, {
                  count: releasableIds.length,
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
            isLoading={loading}
            noData={emptyMessage}
            dataAttribute="perimeter-vault-table"
          />
        </div>
      </div>
    </>
  );
};

export default PerimeterPage;
export { PerimeterPage };
