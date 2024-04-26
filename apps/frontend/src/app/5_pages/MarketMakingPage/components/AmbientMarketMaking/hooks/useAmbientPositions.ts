import axios from 'axios';

import { useCacheCall } from '../../../../../../hooks';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { getIndexerUri } from '../../../../../../utils/indexer';
import { AmbientPosition } from '../AmbientMarketMaking.types';

export const useAmbientPositions = () => {
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const { value: blockNumber } = useBlockNumber(chainId);

  const { value: positions, loading } = useCacheCall(
    `user_positions/${account}`,
    chainId,
    async () => {
      if (!account) {
        return [];
      }
      try {
        const { data } = await axios.get<any>(
          `${getIndexerUri(
            chainId,
          )}/user_positions?user=${account}&chainId=${chainId}`,
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
