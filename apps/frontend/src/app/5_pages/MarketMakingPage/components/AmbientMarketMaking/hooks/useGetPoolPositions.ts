import axios from 'axios';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useCachedData } from '../../../../../../hooks/useCachedData';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { getSdexUri } from '../../../../../../utils/indexer';
import { AmbientPosition } from '../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../utils/AmbientLiquidityPool';

export const useGetPoolPositions = (pool: AmbientLiquidityPool) => {
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const { value: blockNumber } = useBlockNumber(chainId);

  const { value: positions, loading } = useCachedData(
    `user_pool_positions?user=${account}&base=${pool.baseAddress}&quote=${pool.quoteAddress}&poolIdx=${pool.poolIndex}&chainId=${chainId}`,
    chainId,
    async () => {
      if (!account) {
        return [];
      }
      try {
        const { data } = await axios.get<any>(
          `${getSdexUri(chainId)}/user_pool_positions?user=${account}&base=${
            pool.baseAddress
          }&quote=${pool.quoteAddress}&poolIdx=${
            pool.poolIndex
          }&chainId=${chainId}`,
        );
        return (data.data || []) as AmbientPosition[];
      } catch (error) {
        return [];
      }
    },
    [account, chainId, blockNumber],
    [],
  );

  return {
    positions,
    isLoading: loading,
  };
};
