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
  applyDataAttr,
} from '@sovryn/ui';

import { chains, defaultChainId } from '../../../config/chains';

import { ExportCSV } from '../../2_molecules/ExportCSV/ExportCSV';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { zeroClient } from '../../../utils/clients';
import { EXPORT_RECORD_LIMIT } from '../../../utils/constants';
import {
  StabilityDepositChange,
  StabilityDepositChange_OrderBy,
  StabilityDepositOperation,
  useGetStabilityPoolLazyQuery,
} from '../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../utils/helpers';
import { formatValue } from '../../../utils/math';
import { useGetStabilityPoolHistory } from './hooks/useGetStabilityPoolHistory';

const DEFAULT_PAGE_SIZE = 10;

export const StabilityPoolHistoryFrame: FC = () => {
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

  const { data, loading } = useGetStabilityPoolHistory(
    account,
    pageSize,
    page,
    orderOptions,
  );

  const [getStabilityPool] = useGetStabilityPoolLazyQuery({
    client: zeroClient,
  });

  const stabilityDeposits = useMemo(
    () =>
      (data?.stabilityDeposits[0]?.changes as StabilityDepositChange[]) || [],
    [data],
  );

  const getTransactionType = useCallback(
    (type: StabilityDepositOperation) => {
      switch (type) {
        case StabilityDepositOperation.DepositTokens:
          return t(
            translations.stabilityPoolHistory.stabilityPoolOperation.deposit,
          );
        case StabilityDepositOperation.WithdrawTokens:
          return t(
            translations.stabilityPoolHistory.stabilityPoolOperation.withdrawal,
          );
        case StabilityDepositOperation.WithdrawCollateralGain:
          return t(
            translations.stabilityPoolHistory.stabilityPoolOperation
              .withdrawCollateralGain,
          );
        default:
          return '';
      }
    },
    [t],
  );

  const renderBalanceChange = useCallback(
    (balance: string) => (
      <>
        {balance.length ? (
          <Tooltip
            content={`${balance} ${SupportedTokens.zusd}`}
            trigger={TooltipTrigger.click}
            className="cursor-pointer uppercase"
            tooltipClassName="uppercase"
            {...applyDataAttr('stability-pool-history-balance-change')}
          >
            <span>
              {formatValue(Number(balance), 2)} {SupportedTokens.zusd}
            </span>
          </Tooltip>
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const renderNewBalance = useCallback(
    (stabilityDeposit: StabilityDepositChange) => (
      <>
        {stabilityDeposit ? (
          <Tooltip
            content={
              <>
                {stabilityDeposit.depositedAmountAfter} {SupportedTokens.zusd}
              </>
            }
            trigger={TooltipTrigger.click}
            className="cursor-pointer uppercase"
            tooltipClassName="uppercase"
            {...applyDataAttr('stability-pool-history-new-balance')}
          >
            <span>
              {formatValue(Number(stabilityDeposit.depositedAmountAfter), 2)}{' '}
              {SupportedTokens.zusd}
            </span>
          </Tooltip>
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const generateRowTitle = useCallback(
    (stabilityDeposit: StabilityDepositChange) => {
      return (
        <Paragraph size={ParagraphSize.small}>
          {dateFormat(stabilityDeposit.transaction.timestamp)}
        </Paragraph>
      );
    },
    [],
  );

  const columns = useMemo(
    () => [
      {
        id: 'timestamp',
        title: t(translations.stabilityPoolHistory.table.timestamp),
        cellRenderer: (row: StabilityDepositChange) =>
          dateFormat(row.transaction.timestamp),
        sortable: true,
      },
      {
        id: 'transactionType',
        title: t(translations.stabilityPoolHistory.table.transactionType),
        cellRenderer: (row: StabilityDepositChange) =>
          getTransactionType(row.stabilityDepositOperation),
      },
      {
        id: 'balanceChange',
        title: t(translations.stabilityPoolHistory.table.balanceChange),
        cellRenderer: (row: StabilityDepositChange) =>
          renderBalanceChange(row.depositedAmountChange),
      },
      {
        id: 'newBalance',
        title: t(translations.stabilityPoolHistory.table.newBalance),
        cellRenderer: renderNewBalance,
      },
      {
        id: 'transactionID',
        title: t(translations.stabilityPoolHistory.table.transactionID),
        cellRenderer: (row: StabilityDepositChange) => (
          <TransactionId
            href={`${chain?.blockExplorerUrl}/tx/${row.transaction.id}`}
            value={row.transaction.id}
            {...applyDataAttr('stability-pool-history-address-id')}
          />
        ),
      },
    ],
    [t, chain, getTransactionType, renderBalanceChange, renderNewBalance],
  );

  const onPageChange = useCallback(
    (value: number) => {
      if (stabilityDeposits.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, stabilityDeposits?.length, pageSize],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && stabilityDeposits?.length < pageSize,
    [loading, stabilityDeposits, pageSize],
  );

  const exportData = useCallback(async () => {
    const { data } = await getStabilityPool({
      variables: {
        user: account,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        orderBy: orderOptions.orderBy as StabilityDepositChange_OrderBy,
        orderDirection: orderOptions.orderDirection,
      },
    });

    let list = data?.stabilityDeposits[0]?.changes || [];

    if (!list || !list.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.stabilityPoolHistory.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    return list.map(tx => ({
      timestamp: dateFormat(tx.transaction.timestamp),
      transactionType: tx.stabilityDepositOperation,
      balanceChange: tx.depositedAmountChange,
      newBalance: tx.depositedAmountAfter,
      transactionID: tx.transaction.id,
    }));
  }, [t, account, addNotification, getStabilityPool, orderOptions]);

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
        // disabled={!stabilityDeposits || stabilityDeposits.length === 0}
      />
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={columns}
          rows={stabilityDeposits}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          {...applyDataAttr('redemption-history-table')}
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          {...applyDataAttr('redemption-history-pagination')}
        />
      </div>
    </>
  );
};
