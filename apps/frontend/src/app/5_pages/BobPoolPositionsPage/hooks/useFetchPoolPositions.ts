import { useEffect, useMemo, useState } from 'react';

import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useTokenDetailsByAsset } from '../../../../hooks/useTokenDetailsByAsset';
import { getIndexerUri } from '../../../../utils/indexer';
import { usePoolSpotPrice } from '../../MarketMakingPage/components/AmbientMarketMaking/components/AmbientPoolPositions/hooks/usePoolSpotPrice';
import { AmbientLiquidityPool } from '../../MarketMakingPage/components/AmbientMarketMaking/utils/AmbientLiquidityPool';
import { useGetPoolInfo } from '../../MarketMakingPage/components/BobDepositModal/hooks/useGetPoolInfo';
import { useGetTokenDecimals } from '../../MarketMakingPage/components/BobWIthdrawModal/hooks/useGetTokenDecimals';
import { Position } from '../BobPoolPositionsPage.types';
import { parsePoolPositions } from '../BobPoolPositionsPage.utils';

export const useFetchPoolPositions = (pool: AmbientLiquidityPool) => {
  const [positions, setPositions] = useState<Position[] | undefined>(undefined);
  const [loadedPool, setLoadedPool] = useState<string | undefined>(undefined);

  const chainId = useCurrentChain();

  const { value: price } = usePoolSpotPrice(pool.base, pool.quote);

  const baseEndpointUrl = useMemo(
    () => `${getIndexerUri(chainId)}/pool_positions?`,
    [chainId],
  );

  const poolInfo = useGetPoolInfo(pool.base, pool.quote);

  const { baseTokenDecimals, quoteTokenDecimals } = useGetTokenDecimals(
    poolInfo.poolTokens?.tokenA,
    poolInfo.poolTokens?.tokenB,
  );

  const baseDetails = useTokenDetailsByAsset(pool.base, pool.chainId);
  const quoteDetails = useTokenDetailsByAsset(pool.quote, pool.chainId);

  //   console.log(
  //     `baseTokenDecimals: ${baseTokenDecimals}, quoteTokenDecimals: ${quoteTokenDecimals}, baseDetails: ${baseDetails?.decimals}, quoteDetails: ${quoteDetails?.decimals}`,
  //   );

  useEffect(() => {
    if (
      positions === undefined ||
      loadedPool === undefined ||
      loadedPool.toLowerCase() !== pool.lpTokenAddress?.toLowerCase()
    ) {
      if (price === 0) {
        return;
      }

      console.log(`refetch`);

      fetch(
        baseEndpointUrl +
          new URLSearchParams({
            base: pool.baseAddress.toLowerCase(),
            quote: pool.quoteAddress.toLowerCase(),
            poolIdx: String(pool.poolIndex),
            chainId,
            annotate: 'true', // token quantities
            ensResolution: 'true',
            omitEmpty: 'true',
            omitKnockout: 'true',
            addValue: 'true',
            n: '200',
          }),
      )
        .then(response => response.json())
        .then(json => {
          const poolPositions = json.data;

          const positions = poolPositions.map(item => {
            return parsePoolPositions(
              item,
              baseTokenDecimals,
              quoteTokenDecimals,
              price,
              baseDetails?.symbol || '',
              quoteDetails?.symbol || '',
            );
          });

          setPositions(positions);
          setLoadedPool(pool.lpTokenAddress?.toLowerCase());
        });
    }
  }, [
    pool,
    baseDetails?.symbol,
    baseEndpointUrl,
    baseTokenDecimals,
    chainId,
    pool.base,
    pool.baseAddress,
    pool.poolIndex,
    pool.quote,
    pool.quoteAddress,
    positions,
    price,
    quoteDetails?.symbol,
    quoteTokenDecimals,
    loadedPool,
  ]);

  return positions || [];
};
