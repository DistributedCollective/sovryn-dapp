import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

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

import { chains, defaultChainId } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { BTC_RENDER_PRECISION } from '../../../../../constants/currencies';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { rskClient } from '../../../../../utils/clients';
import { useGetBorrowHistoryLazyQuery } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { useGetNewLoans } from './hooks/useGetNewLoans';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const NewLoanHistoryFrame: FC<PropsWithChildren> = ({ children }) => {
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();

  const [page, setPage] = useState(0);
  const chain = chains.find(chain => chain.id === defaultChainId);

  const { value: block } = useBlockNumber();

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'timestamp',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading, refetch } = useGetNewLoans(
    account,
    pageSize,
    page,
    orderOptions,
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const [getBorrowHistory] = useGetBorrowHistoryLazyQuery({
    client: rskClient,
  });

  const generateRowTitle = useCallback(
    (row: any) => (
      <Paragraph size={ParagraphSize.small} className="text-left">
        {t(translations.collateralSurplusHistory.table.withdrawSurplus)}
        {' - '}
        {dateFormat(row.timestamp)}
      </Paragraph>
    ),
    [],
  );

  const columns = useMemo(
    () => [
      {
        id: 'timestamp',
        title: t(translations.common.tables.columnTitles.timestamp),
        cellRenderer: (tx: any) => dateFormat(tx.timestamp),
        sortable: true,
      },
      {
        id: 'transactionType',
        title: t(translations.common.tables.columnTitles.transactionType),
        cellRenderer: () =>
          t(translations.borrowHistory.transactionTypes.createLoan),
      },
      {
        id: 'collateralAmount',
        title: t(translations.loanHistory.table.collateralAmount),
        cellRenderer: tx => (
          <div className="inline-flex gap-1 items-center">
            <AmountRenderer
              value={tx.newCollateral}
              precision={BTC_RENDER_PRECISION}
              dataAttribute="borrow-new-collateral"
            />
            <AssetRenderer address={tx.collateralToken} />
          </div>
        ),
      },
      {
        id: 'interestRate',
        title: t(translations.loanHistory.table.debtAmount),
        cellRenderer: tx => (
          <div className="inline-flex gap-1 items-center">
            <AmountRenderer
              value={tx.newPrincipal}
              precision={BTC_RENDER_PRECISION}
              dataAttribute="borrow-new-debt"
            />
            <AssetRenderer address={tx.loanToken} />
          </div>
        ),
      },
      {
        id: 'interestRate',
        title: 'Interest Rate',
        cellRenderer: tx => (
          <AmountRenderer value={tx.interestRate} precision={2} suffix="%" />
        ),
      },
      {
        id: 'loanId',
        title: t(translations.loanHistory.table.loanID),
        cellRenderer: tx => (
          <TxIdWithNotification
            href=""
            value={tx.loanId}
            dataAttribute="history-address-id"
          />
        ),
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
    [chain?.blockExplorerUrl],
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
    const { data } = await getBorrowHistory({
      variables: {
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        user: account?.toLowerCase(),
      },
    });
    let list = data?.borrows || [];

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
      timestamp: tx.timestamp,
      transactionType: t(
        translations.borrowHistory.transactionTypes.createLoan,
      ),
      collateralAmount: tx.newCollateral,
      debtAmount: tx.newPrincipal,
      interestRate: tx.interestRate,
      loanId: tx.loanId.id,
      hash: tx.transaction.id,
    }));
  }, [account, addNotification, getBorrowHistory]);

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);

  const { checkMaintenance, States } = useMaintenance();
  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);

  return (
    <>
      <div className="flex-row items-center gap-4 mb-7 flex justify-center lg:justify-start">
        {children}
        <div className="flex-row items-center ml-2 gap-4 hidden lg:inline-flex">
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
