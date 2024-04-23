import axios from 'axios';

import { useCacheCall } from '../../../../../../hooks';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { getIndexerUri } from '../../../../../../utils/indexer';
import { AmbientPosition } from '../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../utils/AmbientLiquidityPool';

export const useGetAmbientPositions = (pool: AmbientLiquidityPool) => {
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const baseToken = useTokenDetailsByAsset(pool.base, pool.chainId);
  const quoteToken = useTokenDetailsByAsset(pool.quote, pool.chainId);
  const { value: blockNumber } = useBlockNumber(chainId);

  const { value: positions, loading } = useCacheCall(
    `user-pools-balance/${pool.base}/${pool.quote}/`,
    chainId,
    async () => {
      if (!baseToken || !quoteToken || !account) {
        return [];
      }
      try {
        const { data } = await axios.get<any>(
          `${getIndexerUri(chainId)}/user_pool_positions?user=${account}&base=${
            baseToken?.address
          }&quote=${quoteToken?.address}&poolIdx=${pool.poolIdx}&chainId=${
            pool.chainId
          }`,
        );

        const filteredPositions = data.data.filter(
          (position: AmbientPosition) =>
            position.ambientLiq > 0 || position.concLiq > 0,
        );

        return filteredPositions;
      } catch (error) {
        return [];
      }
    },
    [
      baseToken?.address,
      quoteToken?.address,
      pool.poolIdx,
      account,
      blockNumber,
      chainId,
    ],
    [],
  );

  return {
    positions,
    isLoading: loading,
  };
};
