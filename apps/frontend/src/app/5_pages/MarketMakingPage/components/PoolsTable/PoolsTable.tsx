import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonSize, ButtonStyle, Table } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { AssetPairSize } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer.types';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';
import { AmmLiquidityPoolDictionary } from '../../utils/AmmLiquidityPoolDictionary';
import { PoolChart } from '../PoolDetails/components/PoolChart/PoolChart';
import { PoolsStatistics } from '../PoolStatistics/PoolStatistics';
import { COLUMNS_CONFIG } from './PoolsTable.constants';
import styles from './PoolsTable.module.css';
import { CurrentBalanceRenderer } from './components/CurrentBalanceRenderer/CurrentBalanceRenderer';
import { PoolsTableReturns } from './components/PoolsTableReturns/PoolsTableReturns';

const ammPools = AmmLiquidityPoolDictionary.list();

type PoolsTableProps = {
  activePool?: string;
  setActivePool: (poolKey: string) => void;
  shouldScroll?: boolean;
  showHighlightedPools?: boolean;
};

export const PoolsTable: FC<PoolsTableProps> = ({
  activePool,
  setActivePool,
  shouldScroll = false,
  showHighlightedPools,
}) => {
  const navigate = useNavigate();
  const { account } = useAccount();
  const tableRef = useRef<HTMLDivElement>(null);

  const pools = useMemo(
    () =>
      ammPools.filter(pool => pool.isHighlighted === !!showHighlightedPools),
    [showHighlightedPools],
  );

  const expandedIndex = useMemo(
    () => pools.findIndex(pool => pool.key === activePool),
    [activePool, pools],
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
    (pool: AmmLiquidityPool) => (
      <div className="lg:flex flex-row w-full">
        <div>
          <PoolsStatistics pool={pool} />
        </div>
        <div className="lg:w-3/4 lg:p-4">
          <PoolChart pool={pool} />
        </div>
      </div>
    ),
    [],
  );

  const onPoolClick = useCallback(
    (pool: AmmLiquidityPool) => setActivePool(pool.key),
    [setActivePool],
  );

  useEffect(() => {
    if (shouldScroll && tableRef.current && activePool) {
      const activeRows = tableRef.current.querySelectorAll(
        `[data-pool-key="${activePool}"]`,
      );
      activeRows.forEach(activeRow => {
        const parentElement = activeRow.parentElement;
        if (
          parentElement?.dataset.layoutId &&
          !parentElement.nextElementSibling
        ) {
          parentElement.click();
        }
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, [activePool, shouldScroll]);

  return (
    <div ref={tableRef} className="bg-gray-90 py-4 px-4 rounded w-full">
      {account && (
        <div className="flex justify-end mb-2.5">
          <Button
            style={ButtonStyle.ghost}
            size={ButtonSize.small}
            text={t(translations.marketMakingPage.rewards)}
            onClick={() => navigate('/rewards')}
            dataAttribute="amm-rewards-button"
            className="w-auto"
          />
        </div>
      )}
      <Table
        columns={COLUMNS_CONFIG}
        rows={pools}
        onRowClick={onPoolClick}
        expandedIndex={expandedIndex}
        className={styles.table}
        noData={t(translations.common.tables.noData)}
        loadingData={t(translations.common.tables.loading)}
        dataAttribute="amm-pool-table"
        expandedClassNames="border border-gray-70 border-t-0"
        preventExpandOnClickClass="prevent-row-click"
        expandedContent={generateExpandedContent}
        subtitleRenderer={pool => (
          <CurrentBalanceRenderer pool={pool} showLabel />
        )}
        rowTitle={generateRowTitle}
      />
    </div>
  );
};
