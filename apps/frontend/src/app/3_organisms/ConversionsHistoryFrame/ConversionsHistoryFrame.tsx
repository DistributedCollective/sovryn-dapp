import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import {
  Table,
  applyDataAttr,
  Pagination,
  OrderOptions,
  OrderDirection,
  NotificationType,
} from '@sovryn/ui';

import { ExportCSV } from '../../2_molecules/ExportCSV/ExportCSV';
import { masset } from '../../5_pages/ConvertPage/ConvertPage.types';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useAccount } from '../../../hooks/useAccount';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { translations } from '../../../locales/i18n';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../utils/constants';
import {
  Conversion,
  ConversionType,
  useGetUserConversionsLazyQuery,
} from '../../../utils/graphql/mynt/generated';
import { dateFormat } from '../../../utils/helpers';
import { useGetConversionsHistory } from './hooks/useGetConversionsHistory';
import { columnsConfig, generateRowTitle } from './utils';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const ConversionsHistoryFrame: React.FC = () => {
  const { account } = useAccount();
  const [page, setPage] = useState(0);

  const { value: block } = useBlockNumber();

  const { addNotification } = useNotificationContext();

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'timestamp',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading, refetch } = useGetConversionsHistory(
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
        user: account,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
      },
    });

    let conversions = data?.conversions || [];

    if (!conversions || !conversions?.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.conversionsHistory.actions.noDataToExport),
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

  return (
    <>
      <ExportCSV
        getData={exportData}
        filename="conversion"
        className="mb-7 hidden lg:inline-flex"
        disabled={!conversions}
      />
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
          {...applyDataAttr('conversions-history-table')}
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          {...applyDataAttr('conversions-history-pagination')}
        />
      </div>
    </>
  );
};
