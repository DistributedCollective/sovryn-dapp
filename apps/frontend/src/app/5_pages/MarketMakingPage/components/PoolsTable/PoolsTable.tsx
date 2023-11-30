import React, { FC, useCallback, useMemo } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonSize, ButtonStyle, Table } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { AssetPairSize } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer.types';
import { useAccount } from '../../../../../hooks/useAccount';
import { translations } from '../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';
import { AmmLiquidityPoolDictionary } from '../../utils/AmmLiquidityPoolDictionary';
import { PoolsStatistics } from '../PoolStatistics/PoolStatistics';
import { COLUMNS_CONFIG } from './PoolsTable.constants';
import styles from './PoolsTable.module.css';
import { PoolsTableReturns } from './components/PoolsTableReturns/PoolsTableReturns';

const ammPools = AmmLiquidityPoolDictionary.list();

type PoolsTableProps = {
  activePool?: string;
  setActivePool: (poolKey: string) => void;
};

export const PoolsTable: FC<PoolsTableProps> = ({
  activePool,
  setActivePool,
}) => {
  const navigate = useNavigate();
  const { account } = useAccount();
  
  const expandedIndex = useMemo(
    () => ammPools.findIndex(pool => pool.key === activePool),
    [activePool],
  );

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
        rows={ammPools}
        onRowClick={pool => setActivePool(pool.key)}
        expandedIndex={expandedIndex}
        className={styles.table}
        noData={t(translations.common.tables.noData)}
        loadingData={t(translations.common.tables.loading)}
        dataAttribute="amm-pool-table"
        expandedClassNames="border border-gray-70 border-t-0"
        preventExpandOnClickClass="prevent-row-click"
        expandedContent={generateExpandedContent}
        rowTitle={generateRowTitle}
      />
    </div>
  );
};
