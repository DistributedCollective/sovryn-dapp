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
  Liquidate_OrderBy,
  useGetLiquidatesLazyQuery,
  useGetLiquidatesQuery,
} from '../../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../../utils/helpers';
import { useGetLoanIds } from '../../../hooks/useGetLoanIds';

export const useGetLiquidationLoans = (
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

  const config = useMemo(
    () => ({
      loanIds,
      skip: page * pageSize,
      pageSize,
      orderBy: (orderOptions.orderBy as Liquidate_OrderBy) || undefined,
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

  const [getLiquidates] = useGetLiquidatesLazyQuery({
    client: rskClient,
  });

  const {
    loading,
    data,
    refetch: refetchLoans,
  } = useGetLiquidatesQuery({
    variables: config,
    client: rskClient,
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.liquidates.map(tx => ({
      id: tx.transaction.id,
      loanId: tx.loanId.id,
      collateralWithdrawAmount: tx.collateralWithdrawAmount,
      repayAmount: tx.repayAmount,
      collateralToken: tx.loanId.collateralToken.symbol,
      loanToken: tx.loanId.loanToken.symbol,
      timestamp: tx.timestamp,
      hash: tx.transaction.id,
    }));
  }, [data]);

  const refetch = useCallback(() => {
    refetchLoans();
    refetchLoanIds();
  }, [refetchLoanIds, refetchLoans]);

  const exportData = useCallback(async () => {
    const { data } = await getLiquidates({
      variables: {
        ...config,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
      },
    });
    let list = data?.liquidates || [];

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
      transactionType: t(translations.borrowHistory.transactionTypes.closeSwap),
      collateralLiquidated: `- ${
        tx.collateralWithdrawAmount
      } ${getTokenDisplayName(tx.loanId.collateralToken.symbol || '')}`,
      debtRepaid: `- ${tx.repayAmount} ${getTokenDisplayName(
        tx.loanId.loanToken.symbol || '',
      )}`,
      loanId: tx.loanId.id,
      TXID: tx.transaction.id,
    }));
  }, [addNotification, config, getLiquidates]);

  return {
    loading: loading || loadingLoanIds,
    data: list,
    refetch,
    exportData,
  };
};
