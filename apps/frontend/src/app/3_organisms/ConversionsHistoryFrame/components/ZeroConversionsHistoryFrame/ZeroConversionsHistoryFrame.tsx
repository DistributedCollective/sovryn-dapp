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

import { BITCOIN } from '../../../../../constants/currencies';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { zeroClient } from '../../../../../utils/clients';
import {
  Redemption,
  Redemption_Filter,
  Redemption_OrderBy,
  useGetRedemptionsLazyQuery,
} from '../../../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { BaseConversionsHistoryFrame } from '../BaseConversionsHistoryFrame/BaseConversionsHistoryFrame';
import { COLUMNS_CONFIG } from './ZeroConversionsHistoryFrame.constants';
import { generateRowTitle } from './ZeroConversionsHistoryFrame.utils';
import { useGetZeroConversionsHistory } from './hooks/useGetZeroConversionsHistory';

export const ZeroConversionsHistoryFrame: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { account } = useAccount();
  const [page, setPage] = useState(0);

  const { value: block } = useBlockNumber();

  const { addNotification } = useNotificationContext();

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'sequenceNumber',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading, refetch } = useGetZeroConversionsHistory(
    account,
    DEFAULT_HISTORY_FRAME_PAGE_SIZE,
    page,
    orderOptions,
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const conversions = useMemo(
    () => (data?.redemptions as Redemption[]) || [],
    [data?.redemptions],
  );

  const [getConversions] = useGetRedemptionsLazyQuery({
    client: zeroClient,
  });

  const exportData = useCallback(async () => {
    const { data } = await getConversions({
      variables: {
        filters: {
          redeemer: account?.toLowerCase(),
        } as Redemption_Filter,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        orderBy: Redemption_OrderBy.SequenceNumber,
        orderDirection: OrderDirection.Desc,
      },
    });

    let conversions = data?.redemptions || [];

    if (!conversions || !conversions?.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        dismissible: true,
        id: nanoid(),
      });
    }

    return conversions.map(redemption => ({
      timestamp: dateFormat(redemption.transaction.timestamp),
      transactionType: t(translations.conversionsHistory.redeem),
      sent: redemption.tokensActuallyRedeemed.length
        ? redemption.tokensActuallyRedeemed
        : '-',
      sentToken: getTokenDisplayName(COMMON_SYMBOLS.ZUSD),
      received: redemption.collateralRedeemed.length
        ? redemption.collateralRedeemed
        : '-',
      receivedToken: BITCOIN,
      redemptionFee: redemption.fee,
      redemptionFeeToken: BITCOIN,
      TXID: redemption.transaction.id,
    }));
  }, [account, addNotification, getConversions]);

  return (
    <BaseConversionsHistoryFrame
      exportData={exportData}
      name="zero-conversions"
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
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="zero-conversions-history-table"
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
