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
  Table,
} from '@sovryn/ui';

import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import { DEFAULT_HISTORY_FRAME_PAGE_SIZE } from '../../../../../constants/general';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { LiquidityHistoryItem } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import {
  generateRowTitle,
  getTransactionType,
} from './MarketMakingHistory.utils';
import { COLUMNS_CONFIG } from './MarketMakingHistoryFrame.constants';
import { useGetMarketMakingHistory } from './hooks/useGetMarketMakingHistory';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const MarketMakingHistoryFrame: FC<PropsWithChildren> = ({
  children,
}) => {
  const [page, setPage] = useState(0);
  const { addNotification } = useNotificationContext();

  const { checkMaintenance, States } = useMaintenance();
  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderDirection: OrderDirection.Desc,
  });

  const { value: block } = useBlockNumber();

  const { data, loading, refetch } = useGetMarketMakingHistory(
    pageSize,
    page,
    orderOptions.orderDirection!,
  );

  const items = useMemo(
    () => (data?.liquidityHistoryItems as LiquidityHistoryItem[]) || [],
    [data?.liquidityHistoryItems],
  );

  const exportData = useCallback(async () => {
    if (!items || items?.length < 1) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    return items.map(item => ({
      timestamp: dateFormat(item.timestamp),
      transactionType: getTransactionType(item),
      balanceChange: item.amount,
      token: getTokenDisplayName(item.reserveToken.symbol || ''),
      transactionId: item.transaction.id,
    }));
  }, [addNotification, items]);

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const onPageChange = useCallback(
    (value: number) => {
      if (items.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, items.length],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && items?.length < pageSize,
    [loading, items],
  );

  const isExportDisabled = useMemo(
    () => !items || items.length === 0 || exportLocked,
    [exportLocked, items],
  );

  return (
    <>
      <div className="flex-row items-center gap-4 mb-7 flex justify-center lg:justify-start">
        {children}

        <div className="flex-row items-center ml-2 gap-4 hidden lg:inline-flex">
          <ExportCSV
            getData={exportData}
            filename="market making transactions"
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
          rows={items}
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="market-making-history-table"
        />

        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="market-making-history-pagination"
        />
      </div>
    </>
  );
};
