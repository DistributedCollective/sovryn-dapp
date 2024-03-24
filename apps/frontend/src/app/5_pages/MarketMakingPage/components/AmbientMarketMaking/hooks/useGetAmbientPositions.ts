import { useMemo } from 'react';

import { BOB_CHAIN_ID } from '../../../../../../config/chains';

import { BOB_INDEXER } from '../../../../../../constants/infrastructure';
import { useFetch } from '../../../../../../hooks/useFetch';
import { AmbientPosition } from '../AmbientMarketMaking.types';

const account = '0xDFEC0328a07C399A7e32364DEfd3bE6aaB9365D3';
const base = '0x0000000000000000000000000000000000000000';
const quote = '0x6b175474e89094c44da98b954eedeac495271d0f';
const poolIdx = '420';
const chainId = '0x1';

export const useGetAmbientPositions = () => {
  const { value, loading } = useFetch(
    `${BOB_INDEXER[BOB_CHAIN_ID]}user_pool_positions?user=${account}&base=${base}&quote=${quote}&poolIdx=${poolIdx}&chainId=${chainId}`,
  );

  const positions = useMemo(
    () => value?.data as AmbientPosition[],
    [value?.data],
  );

  return {
    positions,
    isLoading: loading,
  };
};
