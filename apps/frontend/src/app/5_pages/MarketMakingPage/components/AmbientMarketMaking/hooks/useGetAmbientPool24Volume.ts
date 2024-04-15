import { useMemo } from 'react';

import { BOB } from '../../../../../../constants/infrastructure/bob';
import { useFetch } from '../../../../../../hooks/useFetch';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { Environments } from '../../../../../../types/global';
import { isMainnet } from '../../../../../../utils/helpers';
import { AmbientPoolCandle } from '../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../utils/AmbientLiquidityPool';

export const useGetAmbientPool24Volume = (pool: AmbientLiquidityPool) => {
  const baseToken = useTokenDetailsByAsset(pool.base, pool.chainId);
  const quoteToken = useTokenDetailsByAsset(pool.quote, pool.chainId);

  const { value: candles, loading } = useFetch(
    `${
      BOB.indexer[isMainnet() ? Environments.Mainnet : Environments.Testnet]
    }/pool_candles?base=${baseToken?.address}&quote=${
      quoteToken?.address
    }&poolIdx=${pool.poolIdx}&chainId=${pool.chainId}&n=2&period=86400`,
  );

  const data = useMemo(() => {
    return (candles[0] as AmbientPoolCandle) || undefined;
  }, [candles]);

  return {
    data,
    loading,
  };
};
