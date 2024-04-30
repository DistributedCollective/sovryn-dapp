import axios from 'axios';

import { useCacheCall } from '../../../../../../hooks';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { getIndexerUri } from '../../../../../../utils/indexer';
import { AmbientTransaction } from '../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../utils/AmbientLiquidityPool';

export const useGetAmbientTransactions = (pool: AmbientLiquidityPool) => {
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const baseToken = useTokenDetailsByAsset(pool.base, pool.chainId);
  const quoteToken = useTokenDetailsByAsset(pool.quote, pool.chainId);

  const { value: transactions, loading } = useCacheCall(
    `user-pools-balance/${pool.base}/${pool.quote}/${pool.poolIndex}/${account}`,
    chainId,
    async () => {
      if (!baseToken || !quoteToken || !account) {
        return [];
      }
      try {
        const { data } = await axios.get<any>(
          `${getIndexerUri(chainId)}/user_pool_txs?user=${account}&base=${
            baseToken?.address
          }&quote=${quoteToken?.address}&poolIdx=${pool.poolIndex}&chainId=${
            pool.chainId
          }`,
        );

        return (data.data || []) as AmbientTransaction[];
      } catch (error) {
        return [];
      }
    },
    [baseToken?.address, quoteToken?.address, pool.poolIndex, account, chainId],
    [],
  );

  return {
    transactions,
    isLoading: loading,
  };
};
