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
} from '@sovryn/ui';

import { masset } from '../../../../5_pages/ConvertPage/ConvertPage.types';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import {
  Conversion,
  ConversionType,
  useGetUserConversionsLazyQuery,
} from '../../../../../utils/graphql/mynt/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { BaseConversionsHistoryFrame } from '../BaseConversionsHistoryFrame/BaseConversionsHistoryFrame';
import { COLUMNS_CONFIG } from './MyntConversionsHistoryFrame.constants';
import { generateRowTitle } from './MyntConversionsHistoryFrame.utils';
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

  return (
    <BaseConversionsHistoryFrame
      exportData={exportData}
      name="Mynt-conversions"
      table={
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={COLUMNS_CONFIG}
          rows={conversions}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          dataAttribute="amm-conversions-history-table"
        />
      }
      pagination={
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="amm-conversions-history-pagination"
        />
      }
    >
      {children}
    </BaseConversionsHistoryFrame>
  );
};
