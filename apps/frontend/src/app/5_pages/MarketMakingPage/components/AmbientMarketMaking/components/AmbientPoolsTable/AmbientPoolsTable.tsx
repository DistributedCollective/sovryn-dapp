import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import { t } from 'i18next';

import { Table } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { AssetPairSize } from '../../../../../../2_molecules/AssetPairRenderer/AssetPairRenderer.types';
import { useIsMobile } from '../../../../../../../hooks/useIsMobile';
import { translations } from '../../../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { AmmLiquidityPoolDictionary } from '../../../../utils/AmmLiquidityPoolDictionary';
import { CurrentBalanceRenderer } from '../../../PoolsTable/components/CurrentBalanceRenderer/CurrentBalanceRenderer';
import { PoolsTableReturns } from '../../../PoolsTable/components/PoolsTableReturns/PoolsTableReturns';
import { AmbientPoolPositions } from '../AmbientPoolPositions/AmbientPoolPositions';
import { COLUMNS_CONFIG } from './AmbientPoolsTable.constants';
import styles from './AmbientPoolsTable.module.css';

type AmbientPoolsTableProps = {};

const ammPools = AmmLiquidityPoolDictionary.list();

export const AmbientPoolsTable: FC<AmbientPoolsTableProps> = () => {
  const { isMobile } = useIsMobile();
  const [activePool, setActivePool] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  const expandedIndex = useMemo(
    () => ammPools.findIndex(pool => pool.key === activePool),
    [activePool],
  );

  const generateRowTitle = useCallback(
    (pool: AmmLiquidityPool) => (
      <div
        className="flex items-center justify-between w-full"
        data-pool-key={pool.key}
      >
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
    (pool: AmmLiquidityPool) => <AmbientPoolPositions pool={pool} />,
    [],
  );

  const mobileRenderer = useCallback(
    (pool: AmmLiquidityPool) => <AmbientPoolPositions pool={pool} />,
    [],
  );

  const onPoolClick = useCallback(
    (pool: AmmLiquidityPool) => setActivePool(pool.key),
    [setActivePool],
  );

  return (
    <div ref={tableRef} className="bg-gray-90 py-4 px-4 rounded w-full mt-8">
      <Table
        columns={COLUMNS_CONFIG}
        rows={ammPools}
        noData={t(translations.common.tables.noData)}
        loadingData={t(translations.common.tables.loading)}
        dataAttribute="ambient-pool-table"
        expandedClassNames="border border-gray-70 border-t-0"
        preventExpandOnClickClass="prevent-row-click"
        expandedContent={!isMobile ? generateExpandedContent : undefined}
        onRowClick={onPoolClick}
        expandedIndex={expandedIndex}
        subtitleRenderer={pool => (
          <CurrentBalanceRenderer pool={pool} showLabel />
        )}
        className={styles.table}
        rowTitle={generateRowTitle}
        mobileRenderer={mobileRenderer}
      />
    </div>
  );
};
