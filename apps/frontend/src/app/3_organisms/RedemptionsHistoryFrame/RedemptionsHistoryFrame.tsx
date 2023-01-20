import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  NotificationType,
  OrderDirection,
  OrderOptions,
  Pagination,
  Paragraph,
  ParagraphSize,
  Table,
  Tooltip,
  TooltipTrigger,
  TransactionId,
} from '@sovryn/ui';

import { chains, defaultChainId } from '../../../config/chains';

import { ExportCSV } from '../../2_molecules/ExportCSV/ExportCSV';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { EXPORT_RECORD_LIMIT } from '../../../utils/constants';
import { Redemption } from '../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../utils/helpers';
import { formatValue } from '../../../utils/math';
import { useGetRedemptionsHistory } from './hooks/useGetRedemptionsHistory';

// TODO usage example, to be removed
const DEFAULT_PAGE_SIZE = 10;

export const RedemptionsHistoryFrame: FC = () => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const chain = chains.find(chain => chain.id === defaultChainId);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'sequenceNumber',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading } = useGetRedemptionsHistory(
    account,
    pageSize,
    page,
    orderOptions,
  );

  const redemptions = useMemo(() => {
    if (!data) {
      return null;
    }

    return data.redemptions;
  }, [data]);

  const generateRowTitle = useCallback((redemption: Redemption) => {
    return (
      <Paragraph size={ParagraphSize.small}>
        {dateFormat(redemption.transaction.timestamp)}
      </Paragraph>
    );
  }, []);

  const renderZUSDRedeemed = useCallback(
    (redemption: Redemption) => (
      <>
        {redemption.tokensActuallyRedeemed.length ? (
          <Tooltip
            content={
              <>
                {redemption.tokensActuallyRedeemed}{' '}
                {SupportedTokens.zusd.toUpperCase()}
              </>
            }
            trigger={TooltipTrigger.click}
            className="cursor-pointer uppercase"
            tooltipClassName="uppercase"
            dataAttribute="collateral-change-tooltip"
          >
            <span>
              {formatValue(Number(redemption.tokensActuallyRedeemed), 2)}{' '}
              {SupportedTokens.zusd.toUpperCase()}
            </span>
          </Tooltip>
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
          <Tooltip
            content={
              <>
                {redemption.collateralRedeemed}{' '}
                {SupportedTokens.rbtc.toUpperCase()}
              </>
            }
            trigger={TooltipTrigger.click}
            className="cursor-pointer uppercase"
            tooltipClassName="uppercase"
            dataAttribute="collateral-change-tooltip"
          >
            <span>
              {formatValue(Number(redemption.collateralRedeemed), 6)}{' '}
              {SupportedTokens.rbtc.toUpperCase()}
            </span>
          </Tooltip>
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
          <Tooltip
            content={
              <>
                {redemption.fee} {SupportedTokens.rbtc.toUpperCase()}
              </>
            }
            trigger={TooltipTrigger.click}
            className="cursor-pointer uppercase"
            tooltipClassName="uppercase"
            dataAttribute="collateral-change-tooltip"
          >
            <span>
              {formatValue(Number(redemption.fee), 6)}{' '}
              {SupportedTokens.rbtc.toUpperCase()}
            </span>
          </Tooltip>
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
        title: t(translations.redemptionsHistory.table.timestamp),
        cellRenderer: (item: Redemption) =>
          dateFormat(item.transaction.timestamp),
        sortable: true,
      },
      {
        id: 'zusdRedeemed',
        title: t(translations.redemptionsHistory.table.zusdRedeemed),
        cellRenderer: (item: Redemption) => renderZUSDRedeemed(item),
      },
      {
        id: 'rbtcReceived',
        title: t(translations.redemptionsHistory.table.rbtcReceived),
        cellRenderer: (item: Redemption) => renderRBTCReceived(item),
      },
      {
        id: 'redemptionFee',
        title: t(translations.redemptionsHistory.table.redemptionFee),
        cellRenderer: (item: Redemption) => renderRedemptionFee(item),
      },
      {
        id: 'transactionID',
        title: t(translations.redemptionsHistory.table.transactionID),
        cellRenderer: (item: Redemption) => (
          <TransactionId
            href={`${chain?.blockExplorerUrl}/tx/${item.transaction.id}`}
            value={item.transaction.id}
            dataAttribute="history-address-id"
          />
        ),
      },
    ],
    [t, chain, renderZUSDRedeemed, renderRBTCReceived, renderRedemptionFee],
  );

  const onPageChange = useCallback(
    (value: number) => {
      if (redemptions?.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, redemptions, pageSize],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && redemptions?.length < pageSize,
    [loading, redemptions, pageSize],
  );

  const exportData = useCallback(() => {
    if (!redemptions) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.redemptionsHistory.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    setPageSize(EXPORT_RECORD_LIMIT);

    return redemptions.map((tx: Redemption) => ({
      timestamp: dateFormat(tx.transaction.timestamp),
      zusdRedeemed: tx.tokensActuallyRedeemed,
      rbtcReceived: tx.collateralRedeemed,
      redemptionFee: tx.fee,
      transactionID: tx.transaction.id,
    }));
  }, [t, redemptions, addNotification]);

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);

  return (
    <>
      <ExportCSV
        getData={exportData}
        filename="transactions"
        className="mb-7 hidden lg:inline-flex"
        onExportEnd={() => setPageSize(DEFAULT_PAGE_SIZE)}
        disabled={!redemptions || redemptions.length === 0}
      />
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={columns}
          rows={redemptions}
          rowTitle={row => generateRowTitle(row)}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          dataAttribute="transaction-history-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="transaction-history-pagination"
        />
      </div>
    </>
  );
};
