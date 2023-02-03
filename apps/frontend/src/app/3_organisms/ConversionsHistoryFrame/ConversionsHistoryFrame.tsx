import React, { useMemo, useState } from 'react';

import { t } from 'i18next';

import { Table, applyDataAttr } from '@sovryn/ui';

import { masset } from '../../5_pages/ConvertPage/ConvertPage.types';
import { translations } from '../../../locales/i18n';
import {
  Conversion,
  ConversionType,
} from '../../../utils/graphql/mynt/generated';
import { useGetConversionsHistory } from './hooks/useGetConversionsHistory';

// TODO usage example, to be removed
const DEFAULT_PAGE_SIZE = 3;

export const ConversionsHistoryFrame: React.FC = () => {
  const [page] = useState(0);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const { data, loading } = useGetConversionsHistory(pageSize, page);

  const conversions = useMemo(
    () => (data?.conversions as Conversion[]) || [],
    [data?.conversions],
  );

  //   console.log(`data returned: ${JSON.stringify(data)}`);
  console.log(`conversions: ${JSON.stringify(conversions[0])}`);

  const columns = useMemo(
    () => [
      {
        id: 'timestamp',
        title: 'Timestamp',
        cellRenderer: (item: Conversion) => <>{item.transaction.timestamp}</>,
      },
      {
        id: 'transactionType',
        title: 'Transaction Type',
        cellRenderer: () => <>Convert</>,
      },
      {
        id: 'sent',
        title: 'Sent',
        cellRenderer: (item: Conversion) => (
          <>
            <span>
              {item.type === ConversionType.Incoming
                ? item.bassetQuantity
                : item.massetQuantity}
            </span>{' '}
            <span>
              {item.type === ConversionType.Incoming
                ? item.bAsset.symbol
                : masset}
            </span>
          </>
        ),
      },
      {
        id: 'received',
        title: 'Received',
        cellRenderer: (item: Conversion) => (
          <>
            <span>
              {item.type === ConversionType.Outgoing
                ? item.bassetQuantity
                : item.massetQuantity}
            </span>{' '}
            <span>
              {item.type === ConversionType.Outgoing
                ? item.bAsset.symbol
                : masset}
            </span>
          </>
        ),
      },
      {
        id: 'transactionId',
        title: 'TXID',
        cellRenderer: (item: Conversion) => <>{item.transaction.id}</>,
      },
    ],
    [],
  );
  return (
    <>
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          //   setOrderOptions={setOrderOptions}
          //   orderOptions={orderOptions}
          columns={columns}
          rows={conversions}
          //   rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          {...applyDataAttr('conversions-history-table')}
        />
        {/* <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          {...applyDataAttr('redemption-history-pagination')}
        /> */}
      </div>
    </>
  );
};
