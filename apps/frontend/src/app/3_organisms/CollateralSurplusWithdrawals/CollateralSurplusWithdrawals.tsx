import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import {
  ErrorBadge,
  ErrorLevel,
  NotificationType,
  OrderDirection,
  OrderOptions,
  Pagination,
  Paragraph,
  ParagraphSize,
  Table,
} from '@sovryn/ui';

import { chains, defaultChainId } from '../../../config/chains';

import { ExportCSV } from '../../2_molecules/ExportCSV/ExportCSV';
import { TxIdWithNotification } from '../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useAccount } from '../../../hooks/useAccount';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { translations } from '../../../locales/i18n';
import {
  Bitcoin,
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../utils/constants';
import {
  CollSurplusChange_Filter,
  useGetCollSurplusChangesLazyQuery,
} from '../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../utils/helpers';
import { formatValue } from '../../../utils/math';
import { useGetCollateralSurplusWithdrawals } from './hooks/useGetCollateralSurplusWithdrawals';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const CollateralSurplusHistoryFrame: FC = () => {
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();

  const [page, setPage] = useState(0);
  const chain = chains.find(chain => chain.id === defaultChainId);

  const { value: block } = useBlockNumber();

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'sequenceNumber',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading, refetch } = useGetCollateralSurplusWithdrawals(
    account,
    pageSize,
    page,
    orderOptions,
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const [getCollSurplusChanges] = useGetCollSurplusChangesLazyQuery();

  const renderCollateralChange = useCallback((collSurplusChange: string) => {
    return `${formatValue(Math.abs(Number(collSurplusChange)), 8)} ${Bitcoin}`;
  }, []);

  const generateRowTitle = useCallback((row: any) => {
    return (
      <Paragraph size={ParagraphSize.small}>
        {dateFormat(row.timestamp)}
      </Paragraph>
    );
  }, []);

  const columns = useMemo(
    () => [
      {
        id: 'sequenceNumber',
        title: t(translations.common.tables.columnTitles.timestamp),
        cellRenderer: (tx: any) => dateFormat(tx.timestamp),
        sortable: true,
      },
      {
        id: 'withdrawSurplus',
        title: t(translations.common.tables.columnTitles.transactionType),
        cellRenderer: () =>
          t(translations.collateralSurplusHistory.table.withdrawSurplus),
      },
      {
        id: 'collSurplusChange',
        title: t(translations.collateralSurplusHistory.table.collateralChange),
        cellRenderer: tx => renderCollateralChange(tx.collateralChange),
      },
      {
        id: 'transactionID',
        title: t(translations.common.tables.columnTitles.transactionID),
        cellRenderer: (tx: any) => (
          <TxIdWithNotification
            href={`${chain?.blockExplorerUrl}/tx/${tx.hash}`}
            value={tx.hash}
            dataAttribute="history-address-id"
          />
        ),
      },
    ],
    [chain?.blockExplorerUrl, renderCollateralChange],
  );

  const onPageChange = useCallback(
    (value: number) => {
      if (data?.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, data],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && data?.length < pageSize,
    [loading, data],
  );

  const exportData = useCallback(async () => {
    const { data } = await getCollSurplusChanges({
      variables: {
        skip: 0,
        filters: {
          user_contains: account || '',
          collSurplusAfter: '0',
        } as CollSurplusChange_Filter,
        pageSize: EXPORT_RECORD_LIMIT,
      },
    });
    let list = data?.collSurplusChanges || [];

    if (!list || !list.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    return list.map(tx => ({
      timestamp: dateFormat(tx.transaction.timestamp),
      collateralChange: renderCollateralChange(tx.collSurplusChange),
      transactionType: t(
        translations.collateralSurplusHistory.table.withdrawSurplus,
      ),
      transactionID: tx.transaction.id,
    }));
  }, [account, addNotification, getCollSurplusChanges, renderCollateralChange]);

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);

  const { checkMaintenance, States } = useMaintenance();
  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);

  return (
    <>
      <div className="flex flex-row items-center gap-4 mb-7 hidden lg:inline-flex">
        <ExportCSV
          getData={exportData}
          filename="collateral surplus withdrawals"
          disabled={!data || data.length === 0 || exportLocked}
        />
        {exportLocked && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.featureDisabled)}
          />
        )}
      </div>
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={columns}
          rows={data}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          dataAttribute="surplus-withdrawals-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="surplus-withdrawals-pagination"
        />
      </div>
    </>
  );
};
