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
import { getTokenDisplayNameByAddress } from '../../../../../constants/tokens';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { getCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { SubgraphType, getSubgraphClient } from '../../../../../utils/clients';
import {
  Swap,
  Swap_OrderBy,
  useGetSwapHistoryLazyQuery,
} from '../../../../../utils/graphql/bob/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { fromWei } from '../../../../../utils/math';
import { BaseConversionsHistoryFrame } from '../BaseConversionsHistoryFrame/BaseConversionsHistoryFrame';
import { COLUMNS_CONFIG } from './BobConversionsHistoryFrame.constants';
import { generateRowTitle } from './BobConversionsHistoryFrame.utils';
import { useGetBobConversionsHistory } from './hooks/useGetBobConversionsHistory';

export const BobConversionsHistoryFrame: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { account } = useAccount();
  const [page, setPage] = useState(0);
  const { value: block } = useBlockNumber();

  const { addNotification } = useNotificationContext();

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'time',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading, refetch } = useGetBobConversionsHistory(
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
    client: getSubgraphClient(SubgraphType.GENERAL, getCurrentChain()),
  });

  const exportData = useCallback(async () => {
    const { data } = await getConversions({
      variables: {
        user: account.toLocaleLowerCase(),
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        orderBy: Swap_OrderBy.Time,
        orderDirection: OrderDirection.Desc,
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
      timestamp: dateFormat(Number(tx.time)),
      transactionType:
        tx.qty === '0'
          ? t(translations.conversionsHistory.swapMultihop)
          : t(translations.conversionsHistory.swap),
      sent: tx.inBaseQty
        ? Math.abs(Number(fromWei(tx.baseFlow)))
        : Math.abs(Number(fromWei(tx.quoteFlow))),
      sentToken: tx.inBaseQty
        ? getTokenDisplayNameByAddress(tx.pool.base, getCurrentChain())
        : getTokenDisplayNameByAddress(tx.pool.quote, getCurrentChain()),
      receivedToken: tx.inBaseQty
        ? getTokenDisplayNameByAddress(tx.pool.quote, getCurrentChain())
        : getTokenDisplayNameByAddress(tx.pool.base, getCurrentChain()),
      received: tx.inBaseQty
        ? Math.abs(Number(fromWei(tx.quoteFlow)))
        : Math.abs(Number(fromWei(tx.baseFlow))),
      TXID: tx.transactionHash,
    }));
  }, [account, addNotification, getConversions]);

  return (
    <BaseConversionsHistoryFrame
      exportData={exportData}
      name="bob-conversions"
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
          dataAttribute="bob-conversions-history-table"
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
