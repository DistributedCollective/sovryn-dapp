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
  NotificationType,
  OrderDirection,
  OrderOptions,
  Table,
} from '@sovryn/ui';

import { DEFAULT_HISTORY_FRAME_PAGE_SIZE } from '../../../../../constants/general';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { LendingHistoryType } from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { BaseConversionsHistoryFrame } from '../../../ConversionsHistoryFrame/components/BaseConversionsHistoryFrame/BaseConversionsHistoryFrame';
import { COLUMNS_CONFIG } from './LendingHistoryFrame.constants';
import { LendingEvent } from './LendingHistoryFrame.types';
import {
  generateRowTitle,
  getTransactionType,
} from './LendingHistoryFrame.utils';
import { useGetLendingHistory } from './hooks/useGetLendingHistory';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const LendingHistoryFrame: FC<PropsWithChildren> = ({ children }) => {
  const { account } = useAccount();
  const [page, setPage] = useState(0);
  const [normalizedLendingEvents, setNormalizedLendingEvents] = useState<
    LendingEvent[]
  >([]);
  const [total, setTotal] = useState(0);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'timestamp',
    orderDirection: OrderDirection.Desc,
  });

  const { addNotification } = useNotificationContext();

  const { value: block } = useBlockNumber();

  const { data, loading, refetch } = useGetLendingHistory(account);

  useEffect(() => {
    if (!loading && data?.user?.lendingHistory) {
      const flattenedTxs: LendingEvent[] = data.user.lendingHistory
        .map(
          val =>
            val?.lendingHistory?.map(item => ({
              amount: `${item.type === LendingHistoryType.Lend ? '' : '-'}${
                item.amount
              }`,
              asset: item.asset?.id || '',
              transactionHash: item.transaction?.id,
              timestamp: item.timestamp,
              type: item.type,
              resolvedAsset: getTokenDisplayName(item.asset?.symbol || ''),
            })) || [],
        )
        .flat()
        .sort((a, b) =>
          orderOptions.orderDirection === OrderDirection.Asc
            ? a.timestamp - b.timestamp
            : b.timestamp - a.timestamp,
        );
      setNormalizedLendingEvents(flattenedTxs);
      setTotal(flattenedTxs.length);
    }
  }, [account, data, loading, orderOptions.orderDirection]);

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const exportData = useCallback(async () => {
    if (!normalizedLendingEvents || normalizedLendingEvents.length === 0) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        dismissible: true,
        id: nanoid(),
      });
    }

    return normalizedLendingEvents
      .sort((a, b) =>
        orderOptions.orderDirection === OrderDirection.Asc
          ? a.timestamp - b.timestamp
          : b.timestamp - a.timestamp,
      )
      .map(item => ({
        timestamp: dateFormat(item.timestamp),
        transactionType: getTransactionType(item.type),
        balanceChange: `${item.amount} ${item.resolvedAsset}`,
        txId: item.transactionHash,
      }));
  }, [addNotification, normalizedLendingEvents, orderOptions.orderDirection]);

  const paginatedLendingEvents = useMemo(
    () =>
      normalizedLendingEvents.slice(
        page * pageSize,
        page * pageSize + pageSize,
      ),
    [normalizedLendingEvents, page],
  );

  return (
    <BaseConversionsHistoryFrame
      exportData={exportData}
      name="lending"
      table={
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={COLUMNS_CONFIG}
          rows={paginatedLendingEvents}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          dataAttribute="earn-history-table"
        />
      }
      setPage={setPage}
      page={page}
      totalItems={total}
      isLoading={loading}
    >
      {children}
    </BaseConversionsHistoryFrame>
  );
};
