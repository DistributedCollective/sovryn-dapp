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
  OrderOptions,
  OrderDirection,
  NotificationType,
} from '@sovryn/ui';

import { MASSET } from '../../../../5_pages/ConvertPage/ConvertPage.constants';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import {
  Conversion,
  ConversionType,
  Conversion_OrderBy,
  useGetUserConversionsLazyQuery,
} from '../../../../../utils/graphql/mynt/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { BaseConversionsHistoryFrame } from '../BaseConversionsHistoryFrame/BaseConversionsHistoryFrame';
import { COLUMNS_CONFIG } from './MyntConversionsHistoryFrame.constants';
import { generateRowTitle } from './MyntConversionsHistoryFrame.utils';
import { useGetMyntConversionsHistory } from './hooks/useGetMyntConversionsHistory';

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
    DEFAULT_HISTORY_FRAME_PAGE_SIZE,
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

  const [getConversions] = useGetUserConversionsLazyQuery();

  const exportData = useCallback(async () => {
    const { data } = await getConversions({
      variables: {
        user: account.toLowerCase(),
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        orderBy: Conversion_OrderBy.Timestamp,
        orderDirection: OrderDirection.Desc,
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
      transactionType:
        tx.type === ConversionType.Incoming
          ? t(translations.conversionsHistory.mint)
          : t(translations.conversionsHistory.burn),
      sent:
        tx.type === ConversionType.Incoming
          ? tx.bassetQuantity
          : tx.massetQuantity,
      sentToken:
        tx.type === ConversionType.Incoming
          ? getTokenDisplayName(tx.bAsset.symbol || '')
          : MASSET.toUpperCase(),
      received:
        tx.type === ConversionType.Incoming
          ? tx.massetQuantity
          : tx.bassetQuantity,
      receivedToken:
        tx.type === ConversionType.Incoming
          ? MASSET.toUpperCase()
          : getTokenDisplayName(tx.bAsset.symbol || ''),
      TXID: tx.transaction.id,
    }));
  }, [account, addNotification, getConversions]);

  return (
    <BaseConversionsHistoryFrame
      exportData={exportData}
      name="mynt-conversions"
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
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="mynt-conversions-history-table"
        />
      }
      setPage={setPage}
      page={page}
      totalItems={conversions.length}
      isLoading={loading}
    >
      {children}
    </BaseConversionsHistoryFrame>
  );
};
