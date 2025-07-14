import React, { PropsWithChildren, useCallback } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { ChainId } from '@sovryn/ethers-provider';
import { Table, NotificationType } from '@sovryn/ui';

import { MS } from '../../../../../constants/general';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { usePaginatedIndexer } from '../../../../../hooks/usePaginatedIndexer';
import { translations } from '../../../../../locales/i18n';
import { dateFormat } from '../../../../../utils/helpers';
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

  const exportData = useCallback(async () => {
    if (!data || !data?.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        dismissible: true,
        id: nanoid(),
      });
    }

    return data.map(tx => ({
      timestamp: dateFormat(new Date(tx.confirmedAt).getTime() / MS),
      transactionType: t(translations.conversionsHistory.swap),
      sent: tx.baseAmount,
      sentToken: getTokenDisplayName(tx.base.symbol!),
      received: tx.quoteAmount,
      receivedToken: getTokenDisplayName(tx.quote.symbol!),
      conversionFee: `${tx.fees}`,
      conversionFeeToken: getTokenDisplayName(tx.quote.symbol!),
      TXID: tx.transactionHash,
    }));
  }, [addNotification, data]);

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
