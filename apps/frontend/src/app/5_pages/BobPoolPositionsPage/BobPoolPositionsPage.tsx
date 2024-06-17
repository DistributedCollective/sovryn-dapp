import React, { FC, useMemo, useState } from 'react';

import { Pagination, Select, Table } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { DEFAULT_PAGE_SIZE } from '../../../constants/general';
import { useHandlePagination } from '../../../hooks/useHandlePagination';
import { AmbientLiquidityPoolDictionary } from '../MarketMakingPage/components/AmbientMarketMaking/utils/AmbientLiquidityPoolDictionary';
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

  const positions = useFetchPoolPositions(pool!);

  const { page, onPageChange, paginatedItems, isNextButtonDisabled } =
    useHandlePagination(positions, DEFAULT_PAGE_SIZE);

  return (
    <div className="bg-gray-90 py-4 px-4 rounded w-full mt-8">
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
