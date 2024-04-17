import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { t } from 'i18next';

import {
  ErrorBadge,
  ErrorLevel,
  OrderDirection,
  OrderOptions,
  Pagination,
  Paragraph,
  ParagraphSize,
  Table,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../../../../2_molecules/AssetRenderer/AssetRenderer';
import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { BTC_RENDER_PRECISION } from '../../../../../constants/currencies';
import { DEFAULT_HISTORY_FRAME_PAGE_SIZE } from '../../../../../constants/general';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { getChainById } from '../../../../../utils/chain';
import { dateFormat } from '../../../../../utils/helpers';
import { useGetRolloverLoans } from './hooks/useGetRolloverLoans';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const RolloverLoanHistoryFrame: FC<PropsWithChildren> = ({
  children,
}) => {
  const [page, setPage] = useState(0);
  const chain = getChainById(RSK_CHAIN_ID);

  const { value: block } = useBlockNumber();

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'timestamp',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading, refetch, exportData } = useGetRolloverLoans(
    pageSize,
    page,
    orderOptions,
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const generateRowTitle = useCallback(
    (row: any) => (
      <Paragraph size={ParagraphSize.small} className="text-left">
        {t(translations.borrowHistory.transactionTypes.rollovers)}
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
          t(translations.borrowHistory.transactionTypes.rollovers),
      },
      {
        id: 'principal',
        title: t(translations.loanHistory.table.rolloverFee),
        cellRenderer: tx => (
          <div className="inline-flex gap-1 items-center">
            <AmountRenderer
              value={tx.principal}
              precision={BTC_RENDER_PRECISION}
              dataAttribute="rollover-fee"
              prefix="-"
            />
            <AssetRenderer asset={tx.collateralToken} />
          </div>
        ),
      },
      {
        id: 'collateral',
        title: t(translations.loanHistory.table.newCollateral),
        cellRenderer: tx => (
          <div className="inline-flex gap-1 items-center">
            <AmountRenderer
              value={tx.collateral}
              precision={BTC_RENDER_PRECISION}
              dataAttribute="new-collateral"
            />
            <AssetRenderer asset={tx.collateralToken} />
          </div>
        ),
      },
      {
        id: 'loanId',
        title: t(translations.loanHistory.table.loanID),
        cellRenderer: tx => (
          <TxIdWithNotification
            href=""
            value={tx.loanId}
            dataAttribute="loan-id"
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
            dataAttribute="transaction-id"
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
            filename="Rollover loans"
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
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="rollover-loans-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="rollover-loans-pagination"
        />
      </div>
    </>
  );
};
