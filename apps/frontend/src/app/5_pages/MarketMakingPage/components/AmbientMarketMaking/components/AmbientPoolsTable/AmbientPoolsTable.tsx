import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import { t } from 'i18next';
import { Link } from 'react-router-dom';

import { numberToChainId } from '@sovryn/ethers-provider';
import { Pool } from '@sovryn/sdk';
import { Table } from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { AssetPairSize } from '../../../../../../2_molecules/AssetPairRenderer/AssetPairRenderer.types';
import { useAccount } from '../../../../../../../hooks/useAccount';
import { translations } from '../../../../../../../locales/i18n';
import { AmbientPoolPositions } from '../AmbientPoolPositions/AmbientPoolPositions';
import { COLUMNS_CONFIG } from './AmbientPoolsTable.constants';
import styles from './AmbientPoolsTable.module.css';

type AmbientPoolsProps = {
  items: Pool[];
  filter?: string;
};

export const AmbientPoolsTable: FC<AmbientPoolsProps> = ({ items, filter }) => {
  const { account } = useAccount();
  const [activePool, setActivePool] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  const filteredPools = useMemo(() => {
    if (!filter || filter === '') {
      return items;
    }

    // split by comma, slash and space
    const symbols = filter.toLowerCase().split(/,| |\//);

    return items.filter(pool =>
      symbols.find(
        symbol =>
          pool.base.symbol.toLowerCase().includes(symbol) ||
          pool.quote.symbol.toLowerCase().includes(symbol) ||
          pool.base.name.toLowerCase().includes(symbol) ||
          pool.quote.name.toLowerCase().includes(symbol),
      ),
    );
  }, [filter, items]);

  const expandedIndex = useMemo(
    () => filteredPools.findIndex(pool => pool.identifier === activePool),
    [activePool, filteredPools],
  );

  const generateRowTitle = useCallback(
    (pool: Pool) => (
      <div
        className="flex items-center justify-between w-full"
        data-pool-key={pool.identifier}
      >
        <AssetPairRenderer
          asset1={pool.quote.symbol}
          asset2={pool.base.symbol}
          chainId={numberToChainId(pool.chainId)}
          size={AssetPairSize.small}
        />
      </div>
    ),
    [],
  );

  const generateExpandedContent = useCallback(
    (pool: Pool) => <AmbientPoolPositions pool={pool} />,
    [],
  );

  const onPoolClick = useCallback(
    (pool: Pool) =>
      setActivePool(activePool =>
        activePool === pool.identifier ? '' : pool.identifier,
      ),
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
        rows={filteredPools}
        noData={t(translations.common.tables.noData)}
        loadingData={t(translations.common.tables.loading)}
        rowKey={row => row.identifier}
        dataAttribute="ambient-pool-table"
        expandedClassNames="border border-gray-70 border-t-0"
        preventExpandOnClickClass="prevent-row-click"
        expandedContent={generateExpandedContent}
        onRowClick={account ? onPoolClick : undefined}
        expandedIndex={expandedIndex}
        className={styles.table}
        rowTitle={generateRowTitle}
      />
    </div>
  );
};
