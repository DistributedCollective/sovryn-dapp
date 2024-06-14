import React, { FC } from 'react';

import { Table } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { AmbientLiquidityPoolDictionary } from '../MarketMakingPage/components/AmbientMarketMaking/utils/AmbientLiquidityPoolDictionary';
import { COLUMNS_CONFIG } from './BobPoolPositionsPage.constants';
import { useFetchPoolPositions } from './hooks/useFetchPoolPositions';

// TODO: Change to params, currently it's set to SOV/DLLR
// const BASE_TOKEN_ADDRESS = '0xba20a5e63eeEFfFA6fD365E7e540628F8fC61474';
// const QUOTE_TOKEN_ADDRESS = '0xf3107eEC1e6F067552C035FD87199e1A5169CB20';
const BASE_TOKEN_ADDRESS = '0x13411341d7c3140742B9aF45B8Db6d24f2428F3F';
const QUOTE_TOKEN_ADDRESS = '0x4Ad48819AB9f6601849dD4b73DF9b115C4AeFa3a';

const POOL = AmbientLiquidityPoolDictionary.list(BOB_CHAIN_ID).find(
  item =>
    item.baseAddress.toLowerCase() === BASE_TOKEN_ADDRESS.toLowerCase() &&
    item.quoteAddress.toLowerCase() === QUOTE_TOKEN_ADDRESS.toLowerCase(),
);

const BobPoolPositionsPage: FC = () => {
  const positions = useFetchPoolPositions(POOL!);

  return (
    <div className="bg-gray-90 py-4 px-4 rounded w-full mt-8">
      <Table
        rows={positions}
        columns={COLUMNS_CONFIG}
        rowKey={row => row.positionId}
      />
    </div>
  );
};

export default BobPoolPositionsPage;
