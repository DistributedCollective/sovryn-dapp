import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';

import {
  applyDataAttr,
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
  const { t } = useTranslation();
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();

  const [page, setPage] = useState(0);
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
        title: t(translations.collateralSurplusHistory.table.timestamp),
        cellRenderer: (tx: any) => dateFormat(tx.timestamp),
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
        cellRenderer: tx => renderCollateralChange(tx.collateralChange),
      },
      {
        id: 'transactionID',
        title: t(translations.collateralSurplusHistory.table.transactionID),
        cellRenderer: (tx: any) => (
          <TransactionId
            href={`${chain?.blockExplorerUrl}/tx/${tx.hash}`}
            value={tx.hash}
            {...applyDataAttr('history-address-id')}
          />
        ),
      },
    ],
    [chain?.blockExplorerUrl, renderCollateralChange, t],
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
        title: t(translations.collateralSurplusHistory.actions.noDataToExport),
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
  }, [
    account,
    addNotification,
    getCollSurplusChanges,
    renderCollateralChange,
    t,
  ]);

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);

  return (
    <>
      <ExportCSV
        getData={exportData}
        filename="transactions"
        className="mb-7 hidden lg:inline-flex"
        disabled={!data || data.length === 0}
      />
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
          {...applyDataAttr('surplus-withdrawals-table')}
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          {...applyDataAttr('surplus-withdrawals-pagination')}
        />
      </div>
    </>
  );
};
