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

import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { rskClient } from '../../../../../utils/clients';
import {
  Swap,
  useGetSwapHistoryLazyQuery,
} from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { BaseConversionsHistoryFrame } from '../BaseConversionsHistoryFrame/BaseConversionsHistoryFrame';
import { COLUMNS_CONFIG } from './AmmConversionsHistoryFrame.constants';
import { generateRowTitle } from './AmmConversionsHistoryFrame.utils';
import { useGetAMMConversionsHistory } from './hooks/useGetAMMConversionsHistory';

export const AmmConversionsHistoryFrame: React.FC<PropsWithChildren> = ({
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

  const { data, loading, refetch } = useGetAMMConversionsHistory(
    account,
    DEFAULT_HISTORY_FRAME_PAGE_SIZE,
    page,
    orderOptions,
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const conversions = useMemo(
    () => (data?.swaps as Swap[]) || [],
    [data?.swaps],
  );

  const [getConversions] = useGetSwapHistoryLazyQuery({
    client: rskClient,
  });

  const exportData = useCallback(async () => {
    const { data } = await getConversions({
      variables: {
        user: account.toLocaleLowerCase(),
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
      },
    });

    let conversions = data?.swaps || [];

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
      sent: `${tx.fromAmount} ${tx.fromToken.symbol}`,
      received: `${tx.toAmount} ${tx.toToken.symbol}`,
      TXID: tx.transaction.id,
    }));
  }, [account, addNotification, getConversions]);

  return (
    <BaseConversionsHistoryFrame
      exportData={exportData}
      name="amm-conversions"
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
      setPage={setPage}
      page={page}
      totalItems={conversions.length}
      isLoading={loading}
    >
      {children}
    </BaseConversionsHistoryFrame>
  );
};
