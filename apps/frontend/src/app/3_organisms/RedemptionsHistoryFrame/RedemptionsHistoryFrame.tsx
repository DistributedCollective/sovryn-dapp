import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { SupportedTokens } from '@sovryn/contracts';
import {
  ErrorBadge,
  ErrorLevel,
  NotificationType,
  OrderDirection,
  OrderOptions,
  Pagination,
  Paragraph,
  ParagraphSize,
  Table,
} from '@sovryn/ui';

import { chains, defaultChainId } from '../../../config/chains';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { ExportCSV } from '../../2_molecules/ExportCSV/ExportCSV';
import { TxIdWithNotification } from '../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../constants/currencies';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../constants/general';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useAccount } from '../../../hooks/useAccount';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { translations } from '../../../locales/i18n';
import {
  Redemption,
  Redemption_Filter,
  useGetRedemptionsLazyQuery,
} from '../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../utils/helpers';
import { useGetRedemptionsHistory } from './hooks/useGetRedemptionsHistory';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const RedemptionsHistoryFrame: FC = () => {
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();
  const { value: block } = useBlockNumber();

  const [page, setPage] = useState(0);
  const chain = chains.find(chain => chain.id === defaultChainId);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'sequenceNumber',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading, refetch } = useGetRedemptionsHistory(
    account,
    pageSize,
    page,
    orderOptions,
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const [getRedemptions] = useGetRedemptionsLazyQuery();

  const redemptions = useMemo(() => {
    return (data?.redemptions as Redemption[]) || [];
  }, [data]);

  const generateRowTitle = useCallback(
    (redemption: Redemption) => (
      <Paragraph size={ParagraphSize.small} className="text-left">
        {dateFormat(redemption.transaction.timestamp)}
      </Paragraph>
    ),
    [],
  );

  const renderZUSDRedeemed = useCallback(
    (redemption: Redemption) => (
      <>
        {redemption.tokensActuallyRedeemed.length ? (
          <AmountRenderer
            value={redemption.tokensActuallyRedeemed}
            suffix={SupportedTokens.zusd}
            precision={TOKEN_RENDER_PRECISION}
            dataAttribute="redemption-history-zusd-redeemed"
          />
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const renderRBTCReceived = useCallback(
    (redemption: Redemption) => (
      <>
        {redemption.collateralRedeemed.length ? (
          <AmountRenderer
            value={redemption.collateralRedeemed}
            suffix={BITCOIN}
            precision={BTC_RENDER_PRECISION}
            dataAttribute="redemption-history-rbtc-received"
          />
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const renderRedemptionFee = useCallback(
    (redemption: Redemption) => (
      <>
        {redemption.fee.length ? (
          <AmountRenderer
            value={redemption.fee}
            suffix={BITCOIN}
            precision={BTC_RENDER_PRECISION}
            dataAttribute="redemption-history-fee"
          />
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const columns = useMemo(
    () => [
      {
        id: 'sequenceNumber',
        title: t(translations.common.tables.columnTitles.timestamp),
        cellRenderer: (item: Redemption) =>
          dateFormat(item.transaction.timestamp),
        sortable: true,
      },
      {
        id: 'zusdRedeemed',
        title: t(translations.redemptionsHistory.table.zusdRedeemed),
        cellRenderer: renderZUSDRedeemed,
      },
      {
        id: 'rbtcReceived',
        title: t(translations.redemptionsHistory.table.rbtcReceived),
        cellRenderer: renderRBTCReceived,
      },
      {
        id: 'redemptionFee',
        title: t(translations.redemptionsHistory.table.redemptionFee),
        cellRenderer: renderRedemptionFee,
      },
      {
        id: 'transactionID',
        title: t(translations.common.tables.columnTitles.transactionID),
        cellRenderer: (item: Redemption) => (
          <TxIdWithNotification
            href={`${chain?.blockExplorerUrl}/tx/${item.transaction.id}`}
            value={item.transaction.id}
            dataAttribute="redemption-history-address-id"
          />
        ),
      },
    ],
    [chain, renderZUSDRedeemed, renderRBTCReceived, renderRedemptionFee],
  );

  const onPageChange = useCallback(
    (value: number) => {
      if (redemptions.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, redemptions.length],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && redemptions?.length < pageSize,
    [loading, redemptions],
  );

  const exportData = useCallback(async () => {
    const { data } = await getRedemptions({
      variables: {
        skip: 0,
        filters: {
          redeemer: account || '',
        } as Redemption_Filter,
        pageSize: EXPORT_RECORD_LIMIT,
      },
    });

    let redemptions = data?.redemptions || [];

    if (!redemptions || !redemptions.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    return redemptions.map(tx => ({
      timestamp: dateFormat(tx.transaction.timestamp),
      zusdRedeemed: tx.tokensActuallyRedeemed,
      rbtcReceived: tx.collateralRedeemed,
      redemptionFee: tx.fee,
      transactionID: tx.transaction.id,
    }));
  }, [account, addNotification, getRedemptions]);

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);

  const { checkMaintenance, States } = useMaintenance();
  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);

  return (
    <>
      <div className="flex-row items-center gap-4 mb-7 hidden lg:inline-flex">
        <ExportCSV
          getData={exportData}
          filename="redemptions"
          disabled={!redemptions || redemptions.length === 0 || exportLocked}
        />
        {exportLocked && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.featureDisabled)}
          />
        )}
      </div>
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={columns}
          rows={redemptions}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          dataAttribute="redemption-history-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="redemption-history-pagination"
        />
      </div>
    </>
  );
};
