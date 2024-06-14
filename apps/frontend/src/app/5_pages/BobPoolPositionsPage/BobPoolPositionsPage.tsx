import React, { FC, useMemo, useState } from 'react';

import { Select, Table } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../config/chains';

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

  const positions = useFetchPoolPositions(pool || firstPool);

  return (
    <div className="bg-gray-90 py-4 px-4 rounded w-full mt-8">
      <Select
        value={selectedPool}
        onChange={setSelectedPool}
        options={getPoolsList()}
        className="min-w-36 w-full lg:w-auto mb-8"
      />

      <Table
        rows={positions}
        columns={COLUMNS_CONFIG}
        rowKey={row => row.positionId}
      />
    </div>
  );
};

export default BobPoolPositionsPage;
