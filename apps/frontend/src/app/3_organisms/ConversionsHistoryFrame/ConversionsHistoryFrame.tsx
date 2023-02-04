import React, { useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';

import {
  Table,
  applyDataAttr,
  Pagination,
  OrderOptions,
  OrderDirection,
} from '@sovryn/ui';

import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { DEFAULT_HISTORY_FRAME_PAGE_SIZE } from '../../../utils/constants';
import { Conversion } from '../../../utils/graphql/mynt/generated';
import { useGetConversionsHistory } from './hooks/useGetConversionsHistory';
import { columnsConfig, generateRowTitle } from './utils';

export const ConversionsHistoryFrame: React.FC = () => {
  const { account } = useAccount();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(DEFAULT_HISTORY_FRAME_PAGE_SIZE);

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
          columns={columnsConfig}
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
