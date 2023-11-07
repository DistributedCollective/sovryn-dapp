import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Table } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { AmmLiquidityPoolDictionary } from '../../utils/AmmLiquidityPoolDictionary';
import { COLUMNS_CONFIG } from './MarketMakingTable.constants';

export const MarketMakingTable: FC = () => {
  const ammPools = useMemo(() => AmmLiquidityPoolDictionary.list(), []);

  return (
    <div className="bg-gray-80 py-4 px-4 rounded w-full mt-8">
      <Table
        columns={COLUMNS_CONFIG}
        rows={ammPools}
        className="text-gray-10 lg:px-6 lg:py-4 text-xs"
        noData={t(translations.common.tables.noData)}
        loadingData={t(translations.common.tables.loading)}
        dataAttribute="amm-pool-table"
        expandedClassNames="border border-gray-70 border-t-0"
        preventExpandOnClickClass="prevent-row-click"
      />
    </div>
  );
};
