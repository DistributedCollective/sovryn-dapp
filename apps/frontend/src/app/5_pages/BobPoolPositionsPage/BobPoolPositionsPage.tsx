import React, { FC, useMemo, useState } from 'react';

import {
  Pagination,
  Select,
  SimpleTable,
  SimpleTableRow,
  Table,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { DEFAULT_PAGE_SIZE } from '../../../constants/general';
import { useHandlePagination } from '../../../hooks/useHandlePagination';
import { decimalic } from '../../../utils/math';
import { useGetAmbientPoolStats } from '../MarketMakingPage/components/AmbientMarketMaking/hooks/useGetAmbientPoolStats';
import { AmbientLiquidityPoolDictionary } from '../MarketMakingPage/components/AmbientMarketMaking/utils/AmbientLiquidityPoolDictionary';
import { useGetPoolInfo } from '../MarketMakingPage/components/BobDepositModal/hooks/useGetPoolInfo';
import { useGetTokenDecimals } from '../MarketMakingPage/components/BobWIthdrawModal/hooks/useGetTokenDecimals';
import { COLUMNS_CONFIG } from './BobPoolPositionsPage.constants';
import { getPoolsList } from './BobPoolPositionsPage.utils';
import { useFetchPoolPositions } from './hooks/useFetchPoolPositions';

const firstPool = AmbientLiquidityPoolDictionary.list(BOB_CHAIN_ID)[0];

const BobPoolPositionsPage: FC = () => {
  const [selectedPool, setSelectedPool] = useState(
    firstPool?.lpTokenAddress || '',
  );

  const pool = useMemo(
    () =>
      AmbientLiquidityPoolDictionary.list(BOB_CHAIN_ID).find(
        pool => pool.lpTokenAddress === selectedPool,
      ),
    [selectedPool],
  );

  const poolInfo = useGetPoolInfo(pool!.base, pool!.quote);

  const { baseTokenDecimals, quoteTokenDecimals } = useGetTokenDecimals(
    poolInfo.poolTokens?.tokenA,
    poolInfo.poolTokens?.tokenB,
  );

  const { positions, totalLiquidity: concentratedLiquidity } =
    useFetchPoolPositions(pool!);

  const { stats } = useGetAmbientPoolStats(pool!);

  const ambientLiquidityBase = useMemo(() => {
    if (stats && stats.baseTvl) {
      if (concentratedLiquidity.base === 0) {
        return decimalic(stats.baseTvl).toUnits(baseTokenDecimals || 18);
      }

      return decimalic(stats.baseTvl)
        .toUnits(baseTokenDecimals || 18)
        .sub(
          decimalic(concentratedLiquidity.base).toUnits(
            baseTokenDecimals || 18,
          ),
        );
    }

    return Decimal.ZERO;
  }, [baseTokenDecimals, concentratedLiquidity.base, stats]);

  const ambientLiquidityQuote = useMemo(() => {
    if (stats && stats.quoteTvl) {
      if (concentratedLiquidity.quote === 0) {
        return decimalic(stats.quoteTvl).toUnits(quoteTokenDecimals || 18);
      }

      return decimalic(stats.quoteTvl)
        .toUnits(quoteTokenDecimals || 18)
        .sub(
          decimalic(concentratedLiquidity.quote).toUnits(
            quoteTokenDecimals || 18,
          ),
        );
    }

    return Decimal.ZERO;
  }, [concentratedLiquidity.quote, quoteTokenDecimals, stats]);

  const { page, onPageChange, paginatedItems, isNextButtonDisabled } =
    useHandlePagination(positions, DEFAULT_PAGE_SIZE);

  return (
    <div className="bg-gray-90 py-4 px-4 rounded w-full mt-8">
      <div className="flex justify-between mb-8 max-w-5xl">
        <div>
          <div className="text-lg">
            Total liquidity (ambient + concentrated)
          </div>
          <SimpleTable>
            <SimpleTableRow
              className="mb-8"
              label="Base"
              value={
                <AmountRenderer
                  value={decimalic(stats?.baseTvl).toUnits(
                    baseTokenDecimals || 18,
                  )}
                  suffix={pool!.base}
                />
              }
            />

            <SimpleTableRow
              label="Quote"
              value={
                <AmountRenderer
                  value={decimalic(stats?.quoteTvl).toUnits(
                    quoteTokenDecimals || 18,
                  )}
                  suffix={pool!.quote}
                />
              }
            />
          </SimpleTable>
        </div>

        <div>
          <div className="text-lg">Total ambient liquidity</div>
          <SimpleTable>
            <SimpleTableRow
              className="mb-8"
              label="Base"
              value={
                <AmountRenderer
                  value={ambientLiquidityBase}
                  suffix={pool!.base}
                />
              }
            />

            <SimpleTableRow
              label="Quote"
              value={
                <AmountRenderer
                  value={ambientLiquidityQuote}
                  suffix={pool!.quote}
                />
              }
            />
          </SimpleTable>
        </div>

        <div>
          <div className="text-lg">Total concentrated liquidity</div>
          <SimpleTable>
            <SimpleTableRow
              className="mb-8"
              label="Base"
              value={
                <AmountRenderer
                  value={decimalic(concentratedLiquidity.base).toUnits(
                    baseTokenDecimals || 18,
                  )}
                  suffix={pool!.base}
                />
              }
            />

            <SimpleTableRow
              label="Quote"
              value={
                <AmountRenderer
                  value={decimalic(concentratedLiquidity.quote).toUnits(
                    quoteTokenDecimals || 18,
                  )}
                  suffix={pool!.quote}
                />
              }
            />
          </SimpleTable>
        </div>
      </div>

      <Select
        value={selectedPool}
        onChange={setSelectedPool}
        options={getPoolsList()}
        className="min-w-36 w-full lg:w-auto mb-8"
      />

      <>
        <Table
          rows={paginatedItems}
          columns={COLUMNS_CONFIG(pool!)}
          rowKey={row => row.positionId}
        />

        <Pagination
          page={page}
          totalItems={positions.length}
          className="lg:pb-6 mt-3 lg:mt-6 max-w-20"
          onChange={onPageChange}
          itemsPerPage={DEFAULT_PAGE_SIZE}
          isNextButtonDisabled={isNextButtonDisabled}
        />
      </>
    </div>
  );
};

export default BobPoolPositionsPage;
