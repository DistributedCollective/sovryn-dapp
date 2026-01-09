import { useQuery } from '@tanstack/react-query';

import axios from 'axios';

import { Pool } from '@sovryn/sdk';

import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { loadIndexer } from '../../../../../../lib/indexer';
import { AmbientPosition } from '../AmbientMarketMaking.types';

export const useGetAmbientPositions = (pool: Pool) => {
  const { croc } = useCrocContext();
  const chainId = useCurrentChain();
  const { account } = useAccount();

  const { data = [], isLoading } = useQuery({
    queryKey: ['useGetAmbientPositions', { pool, account, chainId }],
    queryFn: async () => {
      if (!croc) {
        return [];
      }

      const { data } = await axios.get<any>(
        `${
          loadIndexer(chainId).url
        }/sdex/user_pool_positions?user=${account}&base=${
          pool.base.address
        }&quote=${pool.quote.address}&poolIdx=${
          pool.extra.poolIdx
        }&chainId=${chainId}`,
      );

      const positions = data.data as AmbientPosition[];

      const filteredPositions = positions.filter(
        (position: AmbientPosition) =>
          Number(position.aggregatedLiquidity) > 0 ||
          Number(position.concLiq) > 0 ||
          Number(position.ambientLiq) > 0,
      );

      return filteredPositions;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!pool.base.address && !!pool.quote.address && !!account && !!croc,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    positions: data,
    isLoading,
  };
};
