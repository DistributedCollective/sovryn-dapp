import React, { FC, useCallback, useMemo, useState } from 'react';

import { t } from 'i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';

import {
  Pagination,
  Paragraph,
  SimpleTableRow,
  Table,
  Button,
} from '@sovryn/ui';

import { AssetPairRenderer } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { AssetPairSize } from '../../../../2_molecules/AssetPairRenderer/AssetPairRenderer.types';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { CurrentBalanceRenderer } from '../../../MarketMakingPage/components/PoolsTable/components/CurrentBalanceRenderer/CurrentBalanceRenderer';
import { PoolsTableLiquidity } from '../../../MarketMakingPage/components/PoolsTable/components/PoolsTableLiquidity/PoolsTableLiquidity';
import { PoolsTableReturns } from '../../../MarketMakingPage/components/PoolsTable/components/PoolsTableReturns/PoolsTableReturns';
import { PoolsTableTradeVolume } from '../../../MarketMakingPage/components/PoolsTable/components/PoolsTableTradeVolume/PoolsTableTradeVolume';
import { AmmLiquidityPool } from '../../../MarketMakingPage/utils/AmmLiquidityPool';
import { AmmLiquidityPoolDictionary } from '../../../MarketMakingPage/utils/AmmLiquidityPoolDictionary';
import { pageTranslations } from '../../ProtocolDataPage.constants';
import { COLUMNS_CONFIG, DEFAULT_PAGE_SIZE } from './MarketMaking.constants';

const pools = AmmLiquidityPoolDictionary.list();

export const MarketMaking: FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const { isMobile } = useIsMobile();

  const onPageChange = useCallback(
    (value: number) => {
      if (pools.length < DEFAULT_PAGE_SIZE && value > page) {
        return;
      }
      setPage(value);
    },
    [page],
  );

  const ammPools = useMemo(
    () =>
      pools?.slice(page * DEFAULT_PAGE_SIZE, (page + 1) * DEFAULT_PAGE_SIZE),
    [page],
  );

  const isNextButtonDisabled = useMemo(
    () => ammPools && ammPools?.length < DEFAULT_PAGE_SIZE,
    [ammPools],
  );

  const generateRowTitle = useCallback(
    (pool: AmmLiquidityPool) => (
      <div
        className="flex items-center justify-between w-full py-1"
        data-pool-key={pool.key}
      >
        <AssetPairRenderer
          asset1={pool.assetA}
          asset2={pool.assetB}
          size={AssetPairSize.small}
        />
        <PoolsTableReturns pool={pool} className="text-sm" />
      </div>
    ),
    [],
  );

  const onPoolClick = useCallback(
    (pool: AmmLiquidityPool) =>
      navigate({
        pathname: '/earn/market-making',
        search: createSearchParams({
          pool: pool.key,
        }).toString(),
      }),
    [navigate],
  );

  const mobileRenderer = useCallback(
    (pool: AmmLiquidityPool) => (
      <div className="flex flex-col px-1">
        <SimpleTableRow
          label={t(translations.protocolDataPage.marketMaking.liquidity)}
          value={<PoolsTableLiquidity pool={pool} />}
        />

        <SimpleTableRow
          label={t(translations.protocolDataPage.marketMaking.contractBalance)}
          value={<CurrentBalanceRenderer pool={pool} showLabel={false} />}
        />

        <SimpleTableRow
          label={t(translations.protocolDataPage.marketMaking.volume)}
          value={<PoolsTableTradeVolume pool={pool} />}
        />

        <Button
          text={t(translations.protocolDataPage.marketMaking.deposit)}
          onClick={() => onPoolClick(pool)}
          className="w-full my-3"
        />
      </div>
    ),
    [onPoolClick],
  );

  return (
    <div className="w-full md:border md:border-gray-50 md:bg-gray-90 md:py-7 md:px-6 rounded mb-9">
      <Paragraph
        className="md:text-2xl text-base font-medium"
        children={t(pageTranslations.marketMaking.title)}
      />
      <div className="mt-2 md:mt-8">
        <Table
          columns={COLUMNS_CONFIG}
          rows={ammPools}
          className="text-gray-10 lg:px-6 lg:py-4 text-xs"
          noData={t(translations.common.tables.noData)}
          loadingData={t(translations.common.tables.loading)}
          dataAttribute="market-making-table"
          rowTitle={generateRowTitle}
          onRowClick={pool => !isMobile && onPoolClick(pool)}
          isClickable
          rowClassName="bg-gray-80"
          mobileRenderer={mobileRenderer}
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-start"
          onChange={onPageChange}
          itemsPerPage={DEFAULT_PAGE_SIZE}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="vesting-stakes-pagination"
        />
      </div>
    </div>
  );
};
