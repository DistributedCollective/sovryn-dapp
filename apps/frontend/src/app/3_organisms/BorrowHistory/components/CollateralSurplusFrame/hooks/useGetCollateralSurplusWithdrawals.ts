import { useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { NotificationType, OrderOptions } from '@sovryn/ui';

import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../../constants/currencies';
import { EXPORT_RECORD_LIMIT } from '../../../../../../constants/general';
import { useNotificationContext } from '../../../../../../contexts/NotificationContext';
import { translations } from '../../../../../../locales/i18n';
import { zeroClient } from '../../../../../../utils/clients';
import {
  CollSurplusChange_Filter,
  CollSurplusChange_OrderBy,
  useGetCollSurplusChangesLazyQuery,
  useGetCollSurplusChangesQuery,
} from '../../../../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../../../../utils/helpers';
import { formatValue } from '../../../../../../utils/math';

export const useGetCollateralSurplusWithdrawals = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const { addNotification } = useNotificationContext();

  const config = useMemo(
    () => ({
      skip: page * pageSize,
      pageSize,
      orderBy: (orderOptions.orderBy as CollSurplusChange_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
      filters: {
        user: account?.toLowerCase() || '',
        collSurplusAfter: '0',
      } as CollSurplusChange_Filter,
    }),
    [page, orderOptions, pageSize, account],
  );

  const { loading, data, refetch } = useGetCollSurplusChangesQuery({
    variables: config,
    client: zeroClient,
  });

  const collSurplusChanges = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.collSurplusChanges.map(tx => ({
      id: tx.id,
      sequenceNumber: tx.sequenceNumber,
      collSurplusChange: tx.collSurplusChange,
      user: tx.user.id,
      timestamp: tx.transaction.timestamp,
      hash: tx.transaction.id,
    }));
  }, [data]);

  const [getCollSurplusChanges] = useGetCollSurplusChangesLazyQuery({
    client: zeroClient,
  });

  const exportData = useCallback(async () => {
    const { data } = await getCollSurplusChanges({
      variables: {
        ...config,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
      },
    });
    let list = data?.collSurplusChanges || [];

    if (!list || !list.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    return list.map(tx => ({
      timestamp: dateFormat(tx.transaction.timestamp),
      collateralChange: formatValue(
        Math.abs(Number(tx.collSurplusChange)),
        BTC_RENDER_PRECISION,
      ),
      collateralChangeToken: BITCOIN,
      transactionType: t(
        translations.collateralSurplusHistory.table.withdrawSurplus,
      ),
      transactionID: tx.transaction.id,
    }));
  }, [addNotification, config, getCollSurplusChanges]);

  return { loading, data: collSurplusChanges, refetch, exportData };
};
