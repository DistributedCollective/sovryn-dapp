import React, { useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Table,
  applyDataAttr,
  Pagination,
  OrderOptions,
  OrderDirection,
  TransactionId,
} from '@sovryn/ui';

import { chains, defaultChainId } from '../../../config/chains';

import { masset } from '../../5_pages/ConvertPage/ConvertPage.types';
import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import {
  Conversion,
  ConversionType,
} from '../../../utils/graphql/mynt/generated';
import { dateFormat } from '../../../utils/helpers';
import { AmountRenderer } from './components/AmountRenderer/AmountRenderer';
import { useGetConversionsHistory } from './hooks/useGetConversionsHistory';
import { generateRowTitle } from './utils';

const chain = chains.find(chain => chain.id === defaultChainId);

const baseTranslation = translations.conversionsHistory;
const tableTranslation = baseTranslation.table;

const sentAmountRenderer = (item: Conversion) => {
  const isIncomingTransaction = item.type === ConversionType.Incoming; // bAsset -> mAsset

  const amount = isIncomingTransaction
    ? item.bassetQuantity
    : item.massetQuantity;
  const asset = isIncomingTransaction
    ? item.bAsset.symbol
    : masset.toUpperCase();

  return <AmountRenderer amount={amount} asset={asset!} />;
};

const receivedAmountRenderer = (item: Conversion) => {
  const isIncomingTransaction = item.type === ConversionType.Incoming; // bAsset -> mAsset

  const amount = isIncomingTransaction
    ? item.massetQuantity
    : item.bassetQuantity;
  const asset = isIncomingTransaction
    ? masset.toUpperCase()
    : item.bAsset.symbol;

  return <AmountRenderer amount={amount} asset={asset!} />;
};

const columns = [
  {
    id: 'timestamp',
    title: t(tableTranslation.timestamp),
    cellRenderer: (item: Conversion) => (
      <>{dateFormat(item.transaction.timestamp)}</>
    ),
    sortable: true,
  },
  {
    id: 'transactionType',
    title: t(tableTranslation.transactionType),
    cellRenderer: () => <>{t(baseTranslation.type)}</>,
  },
  {
    id: 'sent',
    title: t(tableTranslation.sent),
    cellRenderer: sentAmountRenderer,
  },
  {
    id: 'received',
    title: t(tableTranslation.received),
    cellRenderer: receivedAmountRenderer,
  },
  {
    id: 'transactionId',
    title: t(tableTranslation.txId),
    cellRenderer: (item: Conversion) => (
      <TransactionId
        href={`${chain?.blockExplorerUrl}/tx/${item.transaction.id}`}
        value={item.transaction.id}
        dataAttribute="conversion-history-address-id"
      />
    ),
  },
];

// TODO usage example, to be removed
const DEFAULT_PAGE_SIZE = 10;

export const ConversionsHistoryFrame: React.FC = () => {
  const { account } = useAccount();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'timestamp',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading } = useGetConversionsHistory(
    account,
    pageSize,
    page,
    orderOptions,
  );

  const conversions = useMemo(
    () => (data?.conversions as Conversion[]) || [],
    [data?.conversions],
  );

  const onPageChange = useCallback(
    (value: number) => {
      if (conversions?.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [conversions.length, page, pageSize],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && conversions?.length < pageSize,
    [conversions?.length, loading, pageSize],
  );

  return (
    <>
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={columns}
          rows={conversions}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          {...applyDataAttr('conversions-history-table')}
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          {...applyDataAttr('conversions-history-pagination')}
        />
      </div>
    </>
  );
};
