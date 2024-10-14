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
  Table,
} from '@sovryn/ui';

import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import { DEFAULT_HISTORY_FRAME_PAGE_SIZE } from '../../../../../constants/general';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { UserTransaction_OrderBy } from '../../../../../utils/graphql/bobAave/generated';
import { COLUMNS_CONFIG } from './AaveLendingHistoryFrame.constants';
import { LendingHistoryItem } from './AaveLendingHistoryFrame.types';
import { generateRowTitle } from './AaveLendingHistoryFrame.utils';
import { useGetAaveLendingHistory } from './hooks/useGetAaveLendingHistory';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const AaveLendingHistoryFrame: FC<PropsWithChildren> = ({
  children,
}) => {
  const [page, setPage] = useState(0);

  const { checkMaintenance, States } = useMaintenance();
  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: UserTransaction_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
  });

  const { value: block } = useBlockNumber();

  const { data, loading, refetch, exportData } = useGetAaveLendingHistory(
    pageSize,
    page,
    orderOptions,
  );

  const transactions = useMemo(
    () => (data?.userTransactions as LendingHistoryItem[]) || [],
    [data?.userTransactions],
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const onPageChange = useCallback(
    (value: number) => {
      if (transactions.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, transactions.length],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && transactions?.length < pageSize,
    [loading, transactions],
  );

  const isExportDisabled = useMemo(
    () => !transactions || transactions.length === 0 || exportLocked,
    [exportLocked, transactions],
  );

  return (
    <>
      <div className="flex-row items-center gap-4 mb-7 flex justify-center lg:justify-start">
        {children}

        <div className="flex-row items-center ml-2 gap-4 hidden lg:inline-flex">
          <ExportCSV
            getData={exportData}
            filename="lending-history"
            disabled={isExportDisabled}
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
          columns={COLUMNS_CONFIG}
          rowTitle={generateRowTitle}
          rows={transactions}
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="lending-history-table"
        />

        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="lending-history-pagination"
        />
      </div>
    </>
  );
};
