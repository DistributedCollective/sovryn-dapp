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
  DepositCollateral_OrderBy,
  useGetDepositCollateralsLazyQuery,
  useGetDepositCollateralsQuery,
} from '../../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../../utils/helpers';
import { useGetLoanIds } from '../../../hooks/useGetLoanIds';

export const useGetDepositCollateralLoans = (
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

  const [getDepositCollateralLoans] = useGetDepositCollateralsLazyQuery({
    client: rskClient,
  });

  const config = useMemo(
    () => ({
      loanIds,
      skip: page * pageSize,
      pageSize,
      orderBy: (orderOptions.orderBy as DepositCollateral_OrderBy) || undefined,
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
  } = useGetDepositCollateralsQuery({
    variables: config,
    client: rskClient,
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.depositCollaterals.map(tx => ({
      id: tx.transaction.id,
      loanId: tx.loanId.id,
      depositAmount: tx.depositAmount,
      rate: tx.rate,
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
    const { data } = await getDepositCollateralLoans({
      variables: {
        ...config,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
      },
    });
    let list = data?.depositCollaterals || [];

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
      transactionType: t(
        translations.borrowHistory.transactionTypes.depositCollateral,
      ),
      collateralWithdrawn: `+ ${tx.depositAmount} ${getTokenDisplayName(
        tx.loanId.collateralToken.symbol || '',
      )}`,
      loanId: tx.loanId.id,
      TXID: tx.transaction.id,
    }));
  }, [addNotification, config, getDepositCollateralLoans]);

  return {
    loading: loading || loadingLoanIds,
    data: list,
    refetch,
    exportData,
  };
};
