import { useMemo } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useFetch } from '../../../../../../hooks/useFetch';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { getIndexerUri } from '../../../../../../utils/indexer';
import { AmbientPosition } from '../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../utils/AmbientLiquidityPool';

export const useGetAmbientPositions = (pool: AmbientLiquidityPool) => {
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const baseToken = useTokenDetailsByAsset(pool.base, pool.chainId);
  const quoteToken = useTokenDetailsByAsset(pool.quote, pool.chainId);

  const { value, loading } = useFetch(
    `${getIndexerUri(chainId)}/user_pool_positions?user=${account}&base=${
      baseToken?.address
    }&quote=${quoteToken?.address}&poolIdx=${pool.poolIdx}&chainId=${
      pool.chainId
    }`,
  );

  const positions = useMemo(
    () => (value?.data || []) as AmbientPosition[],
    [value?.data],
  );

  return {
    positions,
    isLoading: loading,
  };
};
