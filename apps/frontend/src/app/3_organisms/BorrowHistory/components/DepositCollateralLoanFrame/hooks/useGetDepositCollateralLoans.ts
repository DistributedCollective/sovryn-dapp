import { useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { getTokenDetailsByAddress } from '@sovryn/contracts';
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
    loans,
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

    return data.depositCollaterals.map((tx, i) => {
      const loan = loans[i];

      return {
        id: tx.transaction.id,
        loanId: tx.loanId.id,
        depositAmount: tx.depositAmount,
        rate: tx.rate,
        timestamp: tx.timestamp,
        hash: tx.transaction.id,
        collateralToken: loan?.collateralToken.id,
        loanToken: loan?.loanToken.id,
      };
    });
  }, [data, loans]);

  const refetch = useCallback(() => {
    refetchRollovers();
    refetchLoanIds();
  }, [refetchLoanIds, refetchRollovers]);

  const exportData = useCallback(async () => {
    const { data } = await getDepositCollateralLoans({
      variables: {
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        loanIds,
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

    const result = Promise.all(
      list.map(async (tx, i) => {
        const loan = loans[i];

        let collateralToken = '';
        if (loan?.collateralToken?.id) {
          const token = await getTokenDetailsByAddress(
            loan?.collateralToken?.id,
          ).catch(console.log);
          if (token?.symbol) {
            collateralToken = ` ${getTokenDisplayName(token.symbol)}`;
          }
        }

        return {
          timestamp: dateFormat(tx.timestamp),
          transactionType: t(
            translations.borrowHistory.transactionTypes.depositCollateral,
          ),
          collateralChange: '+' + tx.depositAmount + collateralToken,
          loanId: tx.loanId.id,
          TXID: tx.transaction.id,
        };
      }),
    );
    return result;
  }, [addNotification, getDepositCollateralLoans, loanIds, loans]);

  return {
    loading: loading || loadingLoanIds,
    data: list,
    refetch,
    exportData,
  };
};
