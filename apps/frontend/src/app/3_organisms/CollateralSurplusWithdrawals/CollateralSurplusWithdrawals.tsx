import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  NotificationType,
  OrderDirection,
  OrderOptions,
  Pagination,
  Paragraph,
  ParagraphSize,
  Table,
  TransactionId,
} from '@sovryn/ui';

import { chains, defaultChainId } from '../../../config/chains';

import { ExportCSV } from '../../2_molecules/ExportCSV/ExportCSV';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { EXPORT_RECORD_LIMIT } from '../../../utils/constants';
import { CollSurplusChange } from '../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../utils/helpers';
import { formatValue } from '../../../utils/math';
import { useGetCollateralSurplusWithdrawals } from './hooks/useGetCollateralSurplusWithdrawals';

const DEFAULT_PAGE_SIZE = 10;

export const CollateralSurplusHistoryFrame: FC = () => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const chain = chains.find(chain => chain.id === defaultChainId);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'sequenceNumber',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading } = useGetCollateralSurplusWithdrawals(
    account,
    pageSize,
    page,
    orderOptions,
  );

  const collSurplusChanges = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.collSurplusChanges;
  }, [data]);

  const renderCollateralChange = useCallback((row: CollSurplusChange) => {
    return (
      <>
        {formatValue(Math.abs(Number(row.collSurplusChange)), 8)}{' '}
        {SupportedTokens.rbtc.toUpperCase()}
      </>
    );
  }, []);

  const generateRowTitle = useCallback((row: CollSurplusChange) => {
    return (
      <Paragraph size={ParagraphSize.small}>
        {dateFormat(row.transaction.timestamp)}
      </Paragraph>
    );
  }, []);

  const columns = useMemo(
    () => [
      {
        id: 'sequenceNumber',
        title: t(translations.collateralSurplusHistory.table.timestamp),
        cellRenderer: (item: CollSurplusChange) =>
          dateFormat(item.transaction.timestamp),
        sortable: true,
      },
      {
        id: 'withdrawSurplus',
        title: t(translations.collateralSurplusHistory.table.transactionType),
        cellRenderer: () =>
          t(translations.collateralSurplusHistory.table.withdrawSurplus),
      },
      {
        id: 'collSurplusChange',
        title: t(translations.collateralSurplusHistory.table.collateralChange),
        cellRenderer: renderCollateralChange,
      },
      {
        id: 'transactionID',
        title: t(translations.collateralSurplusHistory.table.transactionID),
        cellRenderer: (item: CollSurplusChange) => (
          <TransactionId
            href={`${chain?.blockExplorerUrl}/tx/${item.transaction.id}`}
            value={item.transaction.id}
            dataAttribute="history-address-id"
          />
        ),
      },
    ],
    [chain?.blockExplorerUrl, renderCollateralChange, t],
  );

  const onPageChange = useCallback(
    (value: number) => {
      if (collSurplusChanges?.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, collSurplusChanges, pageSize],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && collSurplusChanges?.length < pageSize,
    [loading, collSurplusChanges, pageSize],
  );

  const exportData = useCallback(() => {
    if (!collSurplusChanges) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.collateralSurplusHistory.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    setPageSize(EXPORT_RECORD_LIMIT);

    return collSurplusChanges.map((tx: CollSurplusChange) => ({
      timestamp: dateFormat(tx.transaction.timestamp),
      collateralChange: renderCollateralChange(tx),
      transactionType: t(
        translations.collateralSurplusHistory.table.withdrawSurplus,
      ),
      transactionID: tx.transaction.id,
    }));
  }, [collSurplusChanges, addNotification, t, renderCollateralChange]);

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);

  return (
    <>
      <ExportCSV
        getData={exportData}
        filename="transactions"
        className="mb-7 hidden lg:inline-flex"
        onExportEnd={() => setPageSize(DEFAULT_PAGE_SIZE)}
        disabled={!collSurplusChanges || collSurplusChanges.length === 0}
      />
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={columns}
          rows={collSurplusChanges}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          dataAttribute="surplus-withdrawals-table"
        />
        <Pagination
          page={page}
          className="mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="surplus-withdrawals-pagination"
        />
      </div>
    </>
  );
};
