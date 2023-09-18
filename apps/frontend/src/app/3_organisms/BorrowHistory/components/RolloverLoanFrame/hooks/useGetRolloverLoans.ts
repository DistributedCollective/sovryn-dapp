import { useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { NotificationType, OrderOptions } from '@sovryn/ui';

import { EXPORT_RECORD_LIMIT } from '../../../../../../constants/general';
import { getTokenDisplayName } from '../../../../../../constants/tokens';
import { useNotificationContext } from '../../../../../../contexts/NotificationContext';
import { translations } from '../../../../../../locales/i18n';
import { rskClient } from '../../../../../../utils/clients';
import {
  Rollover_OrderBy,
  useGetRolloversLazyQuery,
  useGetRolloversQuery,
} from '../../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../../utils/helpers';
import { useGetLoanIds } from '../../../hooks/useGetLoanIds';

export const useGetRolloverLoans = (
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const {
    loanIds,
    loading: loadingLoanIds,
    refetch: refetchLoanIds,
  } = useGetLoanIds();
  const { addNotification } = useNotificationContext();

  const [getRollovers] = useGetRolloversLazyQuery({
    client: rskClient,
  });

  const config = useMemo(
    () => ({
      loanIds,
      skip: page * pageSize,
      pageSize,
      orderBy: (orderOptions.orderBy as Rollover_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
    }),
    [
      loanIds,
      page,
      pageSize,
      orderOptions.orderBy,
      orderOptions.orderDirection,
    ],
  );

  const {
    loading,
    data,
    refetch: refetchRollovers,
  } = useGetRolloversQuery({
    variables: config,
    client: rskClient,
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.rollovers.map(tx => ({
      id: tx.transaction.id,
      loanId: tx.loanId.id,
      principal: tx.principal,
      collateral: tx.collateral,
      timestamp: tx.timestamp,
      hash: tx.transaction.id,
      collateralToken: tx.loanId.collateralToken.symbol,
      loanToken: tx.loanId.loanToken.symbol,
    }));
  }, [data]);

  const refetch = useCallback(() => {
    refetchRollovers();
    refetchLoanIds();
  }, [refetchLoanIds, refetchRollovers]);

  const exportData = useCallback(async () => {
    const { data } = await getRollovers({
      variables: {
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        loanIds,
        orderBy: Rollover_OrderBy.Timestamp,
      },
    });
    let list = data?.rollovers || [];

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
      timestamp: dateFormat(tx.timestamp),
      transactionType: t(translations.borrowHistory.transactionTypes.rollovers),
      rolloverFee: `${tx.principal} ${getTokenDisplayName(
        tx.loanId.collateralToken.symbol || '',
      )}`,
      newCollateralBalance: `${tx.collateral} ${getTokenDisplayName(
        tx.loanId.collateralToken.symbol || '',
      )}`,
      loanId: tx.loanId.id,
      TXID: tx.transaction.id,
    }));
  }, [addNotification, getRollovers, loanIds]);

  return {
    loading: loading || loadingLoanIds,
    data: list,
    refetch,
    exportData,
  };
};
