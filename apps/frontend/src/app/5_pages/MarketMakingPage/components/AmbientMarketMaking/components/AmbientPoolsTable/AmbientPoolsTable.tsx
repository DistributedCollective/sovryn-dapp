import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import { t } from 'i18next';

import { Table } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { AssetPairSize } from '../../../../../../2_molecules/AssetPairRenderer/AssetPairRenderer.types';
import { useCurrentChain } from '../../../../../../../hooks/useChainStore';
import { useIsMobile } from '../../../../../../../hooks/useIsMobile';
import { translations } from '../../../../../../../locales/i18n';
import { AmbientLiquidityPool } from '../../utils/AmbientLiquidityPool';
import { AmbientLiquidityPoolDictionary } from '../../utils/AmbientLiquidityPoolDictionary';
import { AmbientPoolPositions } from '../AmbientPoolPositions/AmbientPoolPositions';
import { COLUMNS_CONFIG } from './AmbientPoolsTable.constants';
import styles from './AmbientPoolsTable.module.css';

type AmbientPoolsTableProps = {};

export const AmbientPoolsTable: FC<AmbientPoolsTableProps> = () => {
  const chainId = useCurrentChain();
  const { isMobile } = useIsMobile();
  const [activePool, setActivePool] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  const ammPools = useMemo(
    () => AmbientLiquidityPoolDictionary.list(chainId),
    [chainId],
  );

  const expandedIndex = useMemo(
    () => ammPools.findIndex(pool => pool.key === activePool),
    [activePool, ammPools],
  );

  const generateRowTitle = useCallback(
    (pool: AmbientLiquidityPool) => (
      <div
        className="flex items-center justify-between w-full"
        data-pool-key={pool.key}
      >
        <AssetPairRenderer
          asset1={pool.base}
          asset2={pool.quote}
          chainId={pool.chainId}
          size={AssetPairSize.small}
        />
      </div>
    ),
    [],
  );

  const generateExpandedContent = useCallback(
    (pool: AmbientLiquidityPool) => <AmbientPoolPositions pool={pool} />,
    [],
  );

  const mobileRenderer = useCallback(
    (pool: AmbientLiquidityPool) => <AmbientPoolPositions pool={pool} />,
    [],
  );

  const onPoolClick = useCallback(
    (pool: AmbientLiquidityPool) => setActivePool(pool.key),
    [setActivePool],
  );

  return (
    <div ref={tableRef} className="bg-gray-90 py-4 px-4 rounded w-full mt-8">
      <Table
        columns={COLUMNS_CONFIG}
        rows={ammPools}
        noData={t(translations.common.tables.noData)}
        loadingData={t(translations.common.tables.loading)}
        rowKey={row => row.key}
        dataAttribute="ambient-pool-table"
        expandedClassNames="border border-gray-70 border-t-0"
        preventExpandOnClickClass="prevent-row-click"
        expandedContent={!isMobile ? generateExpandedContent : undefined}
        onRowClick={onPoolClick}
        expandedIndex={expandedIndex}
        className={styles.table}
        rowTitle={generateRowTitle}
        mobileRenderer={mobileRenderer}
      />
    </div>
  );
};
