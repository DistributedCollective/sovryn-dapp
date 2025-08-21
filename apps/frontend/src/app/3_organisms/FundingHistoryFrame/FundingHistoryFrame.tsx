import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import {
  NotificationType,
  OrderDirection,
  OrderOptions,
  Pagination,
  Table,
} from '@sovryn/ui';

import { ExportCSV } from '../../2_molecules/ExportCSV/ExportCSV';
import { BITCOIN } from '../../../constants/currencies';
import {
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../constants/general';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useAccount } from '../../../hooks/useAccount';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { translations } from '../../../locales/i18n';
import { rskClient } from '../../../utils/clients';
import {
  BitcoinTransfer,
  BitcoinTransfer_OrderBy,
  useGetFundingLazyQuery,
} from '../../../utils/graphql/rsk/generated';
import { dateFormat } from '../../../utils/helpers';
import { FundingHistoryType } from './FundingHistoryFrame.types';
import {
  columnsConfig,
  generateRowTitle,
  parseData,
  transactionTypeRenderer,
} from './FundingHistoryFrame.utils';
import { useGetFundingHistory } from './hooks/useGetFundingHistory';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const FundingHistoryFrame: FC = () => {
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();
  const { value: block } = useBlockNumber();

  const [page, setPage] = useState(0);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'createdAtTimestamp',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading, refetch } = useGetFundingHistory(
    account,
    pageSize,
    page,
    orderOptions,
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const [getFundingHistory] = useGetFundingLazyQuery({
    client: rskClient,
  });

  const funding = useMemo(
    () => (data?.bitcoinTransfers as BitcoinTransfer[]) || [],
    [data],
  );

  const fundingHistory = useMemo(() => {
    if (account && funding) {
      const data: FundingHistoryType[] = funding.reduce(
        (acc: FundingHistoryType[], item) => acc.concat(parseData(item)),
        [],
      );
      return data;
    }
    return [];
  }, [funding, account]);

  const onPageChange = useCallback(
    (value: number) => {
      if (fundingHistory.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, fundingHistory.length],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && fundingHistory?.length < pageSize,
    [loading, fundingHistory],
  );

  const exportData = useCallback(async () => {
    const { data } = await getFundingHistory({
      variables: {
        user: account,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        orderBy: orderOptions.orderBy as BitcoinTransfer_OrderBy,
        orderDirection: orderOptions.orderDirection,
      },
    });

    let funding = data?.bitcoinTransfers || [];

    if (!funding || !funding.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    const fundingData = funding.reduce((acc: FundingHistoryType[], item) => {
      const rows = parseData(item as BitcoinTransfer);
      // make sure rows has at least 2 elements before using spread operator
      if (rows.length >= 2) {
        acc.push(
          {
            ...rows[0],
            received: `${rows[0].received}`,
            serviceFee: `${rows[0].serviceFee}`,
            type: transactionTypeRenderer(rows[0]),
          },
          {
            ...rows[1],
            sent: `${rows[1].sent}`,
            type: transactionTypeRenderer(rows[1]),
          },
        );
      }
      return acc;
    }, []);

    return fundingData.map(({ ...item }) => ({
      timestamp: dateFormat(item.timestamp),
      type: item.type,
      sent: item.sent,
      received: item.received,
      serviceFee: item.serviceFee,
      token: BITCOIN,
      txHash: item.txHash,
    }));
  }, [account, addNotification, getFundingHistory, orderOptions]);

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);

  return (
    <>
      <ExportCSV
        getData={exportData}
        filename="funding"
        className="mb-7 hidden lg:inline-flex"
        disabled={!funding || funding.length === 0}
      />
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={columnsConfig}
          rows={fundingHistory}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="funding-history-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="funding-history-pagination"
        />
      </div>
    </>
  );
};
