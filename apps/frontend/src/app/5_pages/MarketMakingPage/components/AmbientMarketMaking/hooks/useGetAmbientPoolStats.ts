import { useMemo } from 'react';

import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useFetch } from '../../../../../../hooks/useFetch';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { getIndexerUri } from '../../../../../../utils/indexer';
import { AmbientPoolStats } from '../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../utils/AmbientLiquidityPool';

export const useGetAmbientPoolStats = (pool: AmbientLiquidityPool) => {
  const chainId = useCurrentChain();
  const baseToken = useTokenDetailsByAsset(pool.base, pool.chainId);
  const quoteToken = useTokenDetailsByAsset(pool.quote, pool.chainId);

  const { value, loading } = useFetch(
    `${getIndexerUri(chainId)}/pool_stats?base=${baseToken?.address}&quote=${
      quoteToken?.address
    }&poolIdx=${pool.poolIndex}&chainId=${pool.chainId}`,
  );

  const stats = useMemo(() => {
    return value?.data as AmbientPoolStats | undefined;
  }, [value?.data]);

  return {
    stats,
    loading,
    baseToken,
    quoteToken,
  };
};
