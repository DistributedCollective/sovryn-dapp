import axios from 'axios';

import { ChainId } from '@sovryn/onboard-common';

import { TokenData } from '../../../../../../contexts/TokenPricesContext';
import { useCacheCall } from '../../../../../../hooks';
import { useChainStore } from '../../../../../../hooks/useChainStore';
import { getIndexerUrl } from '../../../../../../utils/helpers';

const indexer = getIndexerUrl();

export const useGetTokens = (chainId?: ChainId) => {
  const { currentChainId } = useChainStore();
  const targetChainId = chainId ?? currentChainId;

  return useCacheCall(
    `tokens/${targetChainId}`,
    targetChainId,
    async () => {
      const { data } = await axios.get(indexer + 'tokens', {
        params: {
          chainId: Number(targetChainId),
        },
      });

      return (data?.data || []) as TokenData[];
    },
    [currentChainId],
    [],
  );
};
