import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import { Table } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { AssetPairSize } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer.types';
import { translations } from '../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';
import { AmmLiquidityPoolDictionary } from '../../utils/AmmLiquidityPoolDictionary';
import { PoolsStatistics } from '../PoolStatistics/PoolStatistics';
import { COLUMNS_CONFIG } from './PoolsTable.constants';
import styles from './PoolsTable.module.css';
import { PoolsTableReturns } from './components/PoolsTableReturns/PoolsTableReturns';

const ammPools = AmmLiquidityPoolDictionary.list();

export const PoolsTable: FC = () => {
  const generateRowTitle = useCallback(
    (pool: AmmLiquidityPool) => (
      <div className="flex items-center justify-between w-full">
        <AssetPairRenderer
          asset1={pool.assetA}
          asset2={pool.assetB}
          size={AssetPairSize.small}
        />
        <PoolsTableReturns pool={pool} className="text-sm font-semibold" />
      </div>
    ),
    [],
  );
  const generateExpandedContent = useCallback(
    (pool: AmmLiquidityPool) => <PoolsStatistics pool={pool} />,
    [],
  );

  return (
    <div className="bg-gray-90 py-4 px-4 rounded w-full mt-8">
      <Table
        columns={COLUMNS_CONFIG}
        rows={ammPools}
        className={styles.table}
        noData={t(translations.common.tables.noData)}
        loadingData={t(translations.common.tables.loading)}
        dataAttribute="amm-pool-table"
        expandedClassNames="border border-gray-70 border-t-0"
        expandedContent={generateExpandedContent}
        rowTitle={generateRowTitle}
        preventExpandOnClickClass="prevent-row-click"
      />
    </div>
  );
};
