import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import {
  Table,
  Pagination,
  OrderOptions,
  OrderDirection,
  NotificationType,
  ErrorBadge,
  ErrorLevel,
} from '@sovryn/ui';

import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import { masset } from '../../../../5_pages/ConvertPage/ConvertPage.types';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import {
  Conversion,
  ConversionType,
  useGetUserConversionsLazyQuery,
} from '../../../../../utils/graphql/mynt/generated';
import { dateFormat } from '../../../../../utils/helpers';
import {
  columnsConfig,
  generateRowTitle,
} from './MyntConversionsHistoryFrame.utils';
import { useGetMyntConversionsHistory } from './hooks/useGetMyntConversionsHistory';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const MyntConversionsHistoryFrame: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { account } = useAccount();
  const [page, setPage] = useState(0);

  const { value: block } = useBlockNumber();

  const { addNotification } = useNotificationContext();

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'timestamp',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading, refetch } = useGetMyntConversionsHistory(
    account,
    pageSize,
    page,
    orderOptions,
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const conversions = useMemo(
    () => (data?.conversions as Conversion[]) || [],
    [data?.conversions],
  );

  const onPageChange = useCallback(
    (value: number) => {
      if (conversions?.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [conversions?.length, page],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && conversions?.length < pageSize,
    [conversions?.length, loading],
  );

  const [getConversions] = useGetUserConversionsLazyQuery();

  const exportData = useCallback(async () => {
    const { data } = await getConversions({
      variables: {
        user: account.toLowerCase(),
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
      },
    });

    let conversions = data?.conversions || [];

    if (!conversions || !conversions?.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        dismissible: true,
        id: nanoid(),
      });
    }

    return conversions.map(tx => ({
      timestamp: dateFormat(tx.transaction.timestamp),
      transactionType: t(translations.conversionsHistory.type),
      sent:
        tx.type === ConversionType.Incoming
          ? `${tx.bassetQuantity} ${tx.bAsset.symbol}`
          : `${tx.massetQuantity} ${masset.toUpperCase()}`,
      received:
        tx.type === ConversionType.Incoming
          ? `${tx.massetQuantity} ${masset.toUpperCase()}`
          : `${tx.bassetQuantity} ${tx.bAsset.symbol}`,
      TXID: tx.transaction.id,
    }));
  }, [account, addNotification, getConversions]);

  const { checkMaintenance, States } = useMaintenance();
  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);

  return (
    <>
      <div className="flex-row items-center gap-4 mb-7 flex justify-center lg:justify-start">
        {children}
        <div className="flex-row items-center ml-2 gap-4 hidden lg:inline-flex">
          <ExportCSV
            getData={exportData}
            filename="conversions"
            disabled={!conversions || exportLocked}
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
          columns={columnsConfig}
          rows={conversions}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          dataAttribute="mynt-conversions-history-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="mynt-conversions-history-pagination"
        />
      </div>
    </>
  );
};
