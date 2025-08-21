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

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import { TableFilter } from '../../../../2_molecules/TableFilter/TableFilter';
import { Filter } from '../../../../2_molecules/TableFilter/TableFilter.types';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { TOKEN_RENDER_PRECISION } from '../../../../../constants/currencies';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { getChainById } from '../../../../../utils/chain';
import { zeroClient } from '../../../../../utils/clients';
import {
  StabilityDepositChange,
  StabilityDepositChange_Filter,
  StabilityDepositChange_OrderBy,
  StabilityDepositOperation,
  useGetStabilityPoolLazyQuery,
} from '../../../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { renderSign } from '../../../BorrowHistory/components/TransactionHistoryFrame/utils';
import { useGetStabilityPoolHistory } from './hooks/useGetStabilityPoolHistory';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

const getTransactionType = (operation: StabilityDepositOperation) => {
  switch (operation) {
    case StabilityDepositOperation.DepositTokens:
      return t(
        translations.stabilityPoolHistory.stabilityPoolOperation.deposit,
      );
    case StabilityDepositOperation.WithdrawTokens:
      return t(
        translations.stabilityPoolHistory.stabilityPoolOperation.withdrawal,
      );
    case StabilityDepositOperation.WithdrawCollateralGain:
    case StabilityDepositOperation.WithdrawGainToLineOfCredit:
      return t(
        translations.stabilityPoolHistory.stabilityPoolOperation.settlement,
      );
    default:
      return operation;
  }
};

export const StabilityPoolHistoryFrame: FC<PropsWithChildren> = ({
  children,
}) => {
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();
  const [filters, setFilters] = useState<StabilityDepositChange_Filter>({});
  const { value: block } = useBlockNumber();

  const [page, setPage] = useState(0);
  const chain = getChainById(RSK_CHAIN_ID);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'sequenceNumber',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading, refetch } = useGetStabilityPoolHistory(
    account,
    pageSize,
    page,
    filters,
    orderOptions,
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const transactionTypeChangeFilters = useMemo(
    () =>
      Object.keys(StabilityDepositOperation).map(key => ({
        label: t(
          translations.stabilityPoolHistory.filters[
            StabilityDepositOperation[key]
          ],
        ),
        filter: 'stabilityDepositOperation_in',
        value: StabilityDepositOperation[key],
        checked: filters['stabilityDepositOperation_in']?.includes(
          StabilityDepositOperation[key],
        )
          ? true
          : false,
      })),
    [filters],
  );

  const updateFilters = useCallback((filterList: Filter[]) => {
    setFilters({
      ...filterList
        .filter(f => !!f.checked)
        .reduce(
          (acc, filter) => ({
            ...acc,
            [filter.filter]: [...(acc[filter.filter] || []), filter.value],
          }),
          {},
        ),
    });
  }, []);

  const [getStabilityPool] = useGetStabilityPoolLazyQuery({
    client: zeroClient,
  });

  const stabilityDeposits = useMemo(
    () =>
      (data?.stabilityDeposits[0]?.changes as StabilityDepositChange[]) || [],
    [data],
  );

  const noDataLabel = useMemo(
    () =>
      Object.keys(filters || {}).length > 0
        ? t(translations.common.tables.noDataWithFilters)
        : t(translations.common.tables.noData),
    [filters],
  );

  const renderBalanceChange = useCallback(
    (balance: string) => (
      <>
        {balance.length ? (
          <AmountRenderer
            value={balance}
            suffix={COMMON_SYMBOLS.ZUSD}
            precision={TOKEN_RENDER_PRECISION}
            dataAttribute="stability-pool-history-balance-change"
            prefix={renderSign(balance)}
          />
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const renderNewBalance = useCallback(
    (stabilityDeposit: StabilityDepositChange) => (
      <>
        {stabilityDeposit ? (
          <AmountRenderer
            value={stabilityDeposit.depositedAmountAfter}
            suffix={COMMON_SYMBOLS.ZUSD}
            precision={TOKEN_RENDER_PRECISION}
            dataAttribute="stability-pool-history-new-balance"
          />
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const generateRowTitle = useCallback(
    (stabilityDeposit: StabilityDepositChange) => (
      <Paragraph size={ParagraphSize.small} className="text-left">
        {getTransactionType(stabilityDeposit.stabilityDepositOperation)}
        {' - '}
        {dateFormat(stabilityDeposit.transaction.timestamp)}
      </Paragraph>
    ),
    [],
  );

  const columns = useMemo(
    () => [
      {
        id: 'sequenceNumber',
        title: t(translations.common.tables.columnTitles.timestamp),
        cellRenderer: (row: StabilityDepositChange) =>
          dateFormat(row.transaction.timestamp),
        sortable: true,
      },
      {
        id: 'transactionType',
        title: t(translations.common.tables.columnTitles.transactionType),
        cellRenderer: (row: StabilityDepositChange) => (
          <>{getTransactionType(row.stabilityDepositOperation)}</>
        ),
        filter: (
          <TableFilter
            filterList={transactionTypeChangeFilters}
            onChange={updateFilters}
          />
        ),
      },
      {
        id: 'balanceChange',
        title: t(translations.stabilityPoolHistory.table.balanceChange),
        cellRenderer: (row: StabilityDepositChange) =>
          renderBalanceChange(row.depositedAmountChange),
      },
      {
        id: 'newBalance',
        title: t(translations.stabilityPoolHistory.table.newBalance),
        cellRenderer: renderNewBalance,
      },
      {
        id: 'transactionID',
        title: t(translations.common.tables.columnTitles.transactionID),
        cellRenderer: (row: StabilityDepositChange) => (
          <TxIdWithNotification
            href={`${chain?.blockExplorerUrl}/tx/${row.transaction.id}`}
            value={row.transaction.id}
            dataAttribute="stability-pool-history-address-id"
          />
        ),
      },
    ],
    [
      chain,
      renderBalanceChange,
      renderNewBalance,
      updateFilters,
      transactionTypeChangeFilters,
    ],
  );

  const onPageChange = useCallback(
    (value: number) => {
      if (stabilityDeposits.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, stabilityDeposits.length],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && stabilityDeposits?.length < pageSize,
    [loading, stabilityDeposits],
  );

  const exportData = useCallback(async () => {
    const { data } = await getStabilityPool({
      variables: {
        user: account,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        orderBy: orderOptions.orderBy as StabilityDepositChange_OrderBy,
        orderDirection: orderOptions.orderDirection,
        filters: filters,
      },
    });

    let list = data?.stabilityDeposits[0]?.changes || [];

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
      transactionType: getTransactionType(tx.stabilityDepositOperation),
      balanceChange: tx.depositedAmountChange,
      newBalance: tx.depositedAmountAfter,
      token: getTokenDisplayName(COMMON_SYMBOLS.ZUSD),
      transactionID: tx.transaction.id,
    }));
  }, [account, getStabilityPool, orderOptions, filters, addNotification]);

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
            filename="stability pool transactions"
            disabled={
              !stabilityDeposits ||
              stabilityDeposits.length === 0 ||
              exportLocked
            }
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
          rows={stabilityDeposits}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={noDataLabel}
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="stability-pool-history-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="stability-pool-history-pagination"
        />
      </div>
    </>
  );
};
