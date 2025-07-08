import React, { PropsWithChildren, useCallback } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { ChainId } from '@sovryn/ethers-provider';
import { Table, OrderDirection, NotificationType } from '@sovryn/ui';

import { EXPORT_RECORD_LIMIT } from '../../../../../constants/general';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { usePaginatedIndexer } from '../../../../../hooks/usePaginatedIndexer';
import { translations } from '../../../../../locales/i18n';
import { rskClient } from '../../../../../utils/clients';
import {
  Swap_OrderBy,
  useGetSwapHistoryLazyQuery,
} from '../../../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { decimalic } from '../../../../../utils/math';
import { BaseConversionsHistoryFrame } from '../BaseConversionsHistoryFrame/BaseConversionsHistoryFrame';
import { COLUMNS_CONFIG, Swap } from './ConversionsHistoryFrame.constants';
import { generateRowTitle } from './ConversionsHistoryFrame.utils';

type ConversionHistoryFrameProps = {
  chain: ChainId;
};

export const ConversionsHistoryFrame: React.FC<
  PropsWithChildren<ConversionHistoryFrameProps>
> = ({ chain, children }) => {
  const { account } = useAccount();

  const { addNotification } = useNotificationContext();

  const {
    response: { data },
    fetchNext,
    isFetching,
  } = usePaginatedIndexer<Swap>(chain, {
    path: '/swaps',
    query: {
      user: account.toLocaleLowerCase(),
    },
  });

  const [getConversions] = useGetSwapHistoryLazyQuery({
    client: rskClient,
  });

  const exportData = useCallback(async () => {
    const { data } = await getConversions({
      variables: {
        user: account.toLocaleLowerCase(),
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        orderBy: Swap_OrderBy.Timestamp,
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
      timestamp: dateFormat(tx.transaction.timestamp),
      transactionType: t(translations.conversionsHistory.swap),
      sent: tx.fromAmount,
      sentToken: getTokenDisplayName(tx.fromToken.symbol!),
      received: tx.toAmount,
      receivedToken: getTokenDisplayName(tx.toToken.symbol!),
      conversionFee: `${decimalic(tx.conversionFee).add(
        tx.protocolFee || '0',
      )}`,
      conversionFeeToken: getTokenDisplayName(tx.toToken.symbol!),
      TXID: tx.transaction.id,
    }));
  }, [account, addNotification, getConversions]);

  return (
    <BaseConversionsHistoryFrame
      exportData={exportData}
      name="amm-conversions"
      table={
        <Table
          columns={COLUMNS_CONFIG(chain)}
          rows={data}
          rowTitle={generateRowTitle}
          isLoading={isFetching}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          dataAttribute="amm-conversions-history-table"
        />
      }
      setPage={() => fetchNext()}
      page={0}
      totalItems={data.length}
      isLoading={isFetching}
    >
      {children}
    </BaseConversionsHistoryFrame>
  );
};
