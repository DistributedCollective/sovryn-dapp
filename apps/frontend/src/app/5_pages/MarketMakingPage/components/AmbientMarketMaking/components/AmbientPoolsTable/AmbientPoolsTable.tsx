import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import { t } from 'i18next';
import { Link } from 'react-router-dom';

import { Table, TableBreakpoint } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { AssetPairSize } from '../../../../../../2_molecules/AssetPairRenderer/AssetPairRenderer.types';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { AmbientLiquidityPool } from '../../utils/AmbientLiquidityPool';
import { AmbientPoolPositions } from '../AmbientPoolPositions/AmbientPoolPositions';
import { COLUMNS_CONFIG } from './AmbientPoolsTable.constants';
import styles from './AmbientPoolsTable.module.css';

type AmbientPoolsProps = {
  items: AmbientLiquidityPool[];
};

export const AmbientPoolsTable: FC<AmbientPoolsProps> = ({ items }) => {
  const { account } = useAccount();
  const [activePool, setActivePool] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);
  const expandedIndex = useMemo(
    () => items.findIndex(pool => pool.key === activePool),
    [activePool, items],
  );

  const generateRowTitle = useCallback(
    (pool: AmbientLiquidityPool) => (
      <div
        className="flex items-center justify-between w-full"
        data-pool-key={pool.key}
      >
        <AssetPairRenderer
          asset1={pool.quote}
          asset2={pool.base}
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

  const onPoolClick = useCallback(
    (pool: AmbientLiquidityPool) =>
      setActivePool(activePool => (activePool === pool.key ? '' : pool.key)),
    [setActivePool],
  );

  return (
    <div ref={tableRef} className="bg-gray-90 py-4 px-4 rounded w-full mt-8">
      <div className="flex justify-end mb-4">
        <Link
          to="/claim-lp"
          className="text-primary-20 text-sm hover:text-primary-10"
        >
          {t(translations.claimLpPage.ammCta)}
        </Link>
      </div>
      <Table
        columns={COLUMNS_CONFIG}
        rows={items}
        noData={t(translations.common.tables.noData)}
        loadingData={t(translations.common.tables.loading)}
        rowKey={row => row.key}
        dataAttribute="ambient-pool-table"
        expandedClassNames="border border-gray-70 border-t-0"
        preventExpandOnClickClass="prevent-row-click"
        expandedContent={generateExpandedContent}
        onRowClick={account ? onPoolClick : undefined}
        expandedIndex={expandedIndex}
        className={styles.table}
        rowTitle={generateRowTitle}
        breakpoint={TableBreakpoint.xl}
      />
    </div>
  );
};
