import React, { FC } from 'react';

import { t } from 'i18next';

import { Table } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { COLUMNS_CONFIG } from './LiquidityBookFrame.constants';
import { useGetPools } from './hooks/useGetPools';

export const LiquidityBookFrame: FC = () => {
  const { pools, loading } = useGetPools();

  return (
    <div className="lg:bg-gray-80 lg:p-4 rounded w-full">
      <Table
        columns={COLUMNS_CONFIG}
        rows={pools}
        isLoading={loading}
        className="text-gray-10 lg:px-6 lg:py-4 text-xs"
        noData={t(translations.common.tables.noData)}
        loadingData={t(translations.common.tables.loading)}
        dataAttribute="liquidity-book-frame-table"
        expandedClassNames="border border-gray-70 border-t-0"
        preventExpandOnClickClass="prevent-row-click"
      />
    </div>
  );
};
