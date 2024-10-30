import { useCallback, useMemo } from 'react';

import { formatUnits } from 'ethers/lib/utils';
import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { NotificationType, OrderDirection, OrderOptions } from '@sovryn/ui';

import { Data } from '../../../../../2_molecules/ExportCSV/ExportCSV.types';
import { EXPORT_RECORD_LIMIT } from '../../../../../../constants/general';
import { useNotificationContext } from '../../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { bobAaveClient } from '../../../../../../utils/clients';
import {
  UserTransaction_OrderBy,
  useUserLendTransactionsLazyQuery,
  useUserLendTransactionsQuery,
} from '../../../../../../utils/graphql/bobAave/generated';
import { dateFormat } from '../../../../../../utils/helpers';
import { TX_FILTERED } from '../AaveLendingHistoryFrame.constants';
import { LendingHistoryItem } from '../AaveLendingHistoryFrame.types';

export const useGetAaveLendingHistory = (
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();

  const config = useMemo(
    () => ({
      userAddress: account,
      skip: page * pageSize,
      first: pageSize,
      orderBy: orderOptions.orderBy as UserTransaction_OrderBy,
      orderDirection: orderOptions.orderDirection as OrderDirection,
    }),
    [
      account,
      orderOptions.orderBy,
      orderOptions.orderDirection,
      page,
      pageSize,
    ],
  );

  const { data, loading, refetch } = useUserLendTransactionsQuery({
    variables: config,
    client: bobAaveClient,
  });

  const [getUserLendTransactions] = useUserLendTransactionsLazyQuery({
    client: bobAaveClient,
  });

  const exportData = useCallback(async (): Promise<Data[]> => {
    const { data } = await getUserLendTransactions({
      variables: {
        ...config,
        skip: 0,
        first: EXPORT_RECORD_LIMIT,
      },
    });
    const list = (
      (data?.userTransactions || []) as LendingHistoryItem[]
    ).filter(tx => !TX_FILTERED.find(i => i === tx.action));

    if (list.length < 1) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    return list.map(item => ({
      timestamp: dateFormat(Number(item.timestamp)),
      type: item.action,
      amount:
        formatUnits(item.amount, item.reserve.decimals) +
        ' ' +
        item.reserve.symbol,
      txHash: item.txHash,
    }));
  }, [addNotification, config, getUserLendTransactions]);

  return {
    data: data,
    loading,
    refetch,
    exportData,
  };
};
