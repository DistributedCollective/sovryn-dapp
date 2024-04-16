import { useMemo } from 'react';

import { BOB } from '../../../../../../constants/infrastructure/bob';
import { useFetch } from '../../../../../../hooks/useFetch';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { Environments } from '../../../../../../types/global';
import { isMainnet } from '../../../../../../utils/helpers';
import { AmbientPoolStats } from '../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../utils/AmbientLiquidityPool';

export const useGetAmbientPoolStats = (pool: AmbientLiquidityPool) => {
  const baseToken = useTokenDetailsByAsset(pool.base, pool.chainId);
  const quoteToken = useTokenDetailsByAsset(pool.quote, pool.chainId);

  const { value, loading } = useFetch(
    `${
      BOB.indexer[isMainnet() ? Environments.Mainnet : Environments.Testnet]
    }/pool_stats?base=${baseToken?.address}&quote=${
      quoteToken?.address
    }&poolIdx=${pool.poolIdx}&chainId=${pool.chainId}`,
  );

  const stats = useMemo(() => {
    return value?.data as AmbientPoolStats | undefined;
  }, [value?.data]);

  return {
    stats,
    loading,
  };
};
