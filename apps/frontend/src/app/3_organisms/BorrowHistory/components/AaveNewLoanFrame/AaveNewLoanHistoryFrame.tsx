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

import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { bobAaveClient } from '../../../../../utils/clients';
import {
  UserTransaction_OrderBy,
  useUserBorrowTransactionsLazyQuery,
} from '../../../../../utils/graphql/bobAave/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { COLUMNS } from './AaveNewLoanHistoryFrame.constants';
import { normalizeUserBorrowTransactions } from './AaveNewLoanHistoryFrame.utils';
import { useGetNewLoans } from './hooks/useGetNewLoans';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const AaveNewLoanHistoryFrame: FC<PropsWithChildren> = ({
  children,
}) => {
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();
  const [page, setPage] = useState(0);

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
    console.log('data', data);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const [getBorrowHistory] = useUserBorrowTransactionsLazyQuery({
    client: bobAaveClient,
  });

  const generateRowTitle = useCallback(
    (row: any) => (
      <Paragraph size={ParagraphSize.small} className="text-left">
        {t(translations.borrowHistory.transactionTypes.createLoan)}
        {' - '}
        {dateFormat(row.timestamp)}
      </Paragraph>
    ),
    [],
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
        first: EXPORT_RECORD_LIMIT,
        userAddress: account?.toLowerCase(),
        orderBy: (orderOptions.orderBy as UserTransaction_OrderBy) || undefined,
        orderDirection: orderOptions.orderDirection || OrderDirection.Desc,
      },
    });
    let list = data?.userTransactions || [];

    if (!data || !list.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
      return [];
    }

    return normalizeUserBorrowTransactions(data).map(item => ({
      id: item.id,
      timestamp: item.timestamp,
      hash: item.hash,
      amount: item.amount,
      asset: item.reserve.symbol,
      borrowRate: item.borrowRate,
      borrowRateMode: item.borrowRateMode,
    }));
  }, [
    account,
    addNotification,
    getBorrowHistory,
    orderOptions.orderBy,
    orderOptions.orderDirection,
  ]);

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
            filename="New loans"
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
          columns={COLUMNS}
          rows={data}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="new-loans-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="new-loans-pagination"
        />
      </div>
    </>
  );
};
