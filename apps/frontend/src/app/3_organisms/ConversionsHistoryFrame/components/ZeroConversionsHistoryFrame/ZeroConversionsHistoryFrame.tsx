import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { SupportedTokens } from '@sovryn/contracts';
import {
  Table,
  Pagination,
  OrderOptions,
  OrderDirection,
  NotificationType,
  ErrorBadge,
  ErrorLevel,
} from '@sovryn/ui';

import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import { BITCOIN } from '../../../../../constants/currencies';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { zeroClient } from '../../../../../utils/clients';
import {
  Redemption,
  Redemption_Filter,
  useGetRedemptionsLazyQuery,
} from '../../../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../../../utils/helpers';
import {
  columnsConfig,
  generateRowTitle,
} from './ZeroConversionsHistoryFrame.utils';
import { useGetZeroConversionsHistory } from './hooks/useGetZeroConversionsHistory';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

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
    pageSize,
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

  const onPageChange = useCallback(
    (value: number) => {
      if (conversions?.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [conversions?.length, page],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && conversions?.length < pageSize,
    [conversions?.length, loading],
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
        ? `${redemption.tokensActuallyRedeemed} ${SupportedTokens.zusd}`
        : '-',
      received: redemption.collateralRedeemed.length
        ? `${redemption.collateralRedeemed} ${BITCOIN}`
        : '-',
      TXID: redemption.transaction.id,
    }));
  }, [account, addNotification, getConversions]);

  const { checkMaintenance, States } = useMaintenance();
  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);

  return (
    <>
      <div className="flex-row items-center gap-4 mb-7 flex justify-center lg:justify-start">
        {children}
        <div className="flex-row items-center ml-2 gap-4 hidden lg:inline-flex">
          <ExportCSV
            getData={exportData}
            filename="conversions"
            disabled={!conversions || exportLocked}
          />
          {exportLocked && (
            <ErrorBadge
              level={ErrorLevel.Warning}
              message={t(translations.maintenanceMode.featureDisabled)}
            />
          )}
        </div>
      </div>
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={columnsConfig}
          rows={conversions}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          dataAttribute="conversions-history-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="conversions-history-pagination"
        />
      </div>
    </>
  );
};
