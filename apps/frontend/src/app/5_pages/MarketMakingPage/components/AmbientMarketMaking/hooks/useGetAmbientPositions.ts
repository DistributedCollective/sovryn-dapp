import axios from 'axios';

import { Pool } from '@sovryn/sdk';

import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { PoolPositionType } from '../../../MarketMakingPage.types';
import { AmbientPosition } from '../AmbientMarketMaking.types';
import { useGetLpTokenBalance } from './useGetLpTokenBalance';
import { useQuery } from '@tanstack/react-query';
import { loadIndexer } from '../../../../../../lib/indexer';

export const useGetAmbientPositions = (pool: Pool) => {
  const { croc } = useCrocContext();
  const chainId = useCurrentChain();
  const { account } = useAccount();

  const lpTokenBalance = useGetLpTokenBalance(pool);

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

      if (pool.extra.lpToken) {
        const wallet = await croc.token(pool.extra.lpToken).wallet(account);
        const ambientIndex = positions.findIndex(
          position => position.positionType === PoolPositionType.ambient,
        );

        const liqBalance = wallet.gt(0) ? wallet.toString() : lpTokenBalance;

        if (ambientIndex !== -1) {
          if (parseFloat(liqBalance) > 0) {
            const ambientPosition = positions[ambientIndex];
            ambientPosition.ambientLiq = liqBalance;
          }
        } else if (parseFloat(liqBalance) > 0) {
          positions.push({
            ambientLiq: liqBalance,
            concLiq: '0',
            rewardLiq: '0',
            baseQty: '0',
            quoteQty: '0',
            aggregatedLiquidity: '0',
            aggregatedBaseFlow: '0',
            aggregatedQuoteFlow: '0',
            positionType: PoolPositionType.ambient,
            bidTick: 0,
            askTick: 0,
            aprDuration: '0',
            aprPostLiq: '0',
            aprContributedLiq: '0',
            aprEst: '0',
            transactionHash: '',
            time: '',
          } as AmbientPosition);
        }
      }

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
    enabled: !!pool.base.address && !!pool.quote.address && !!account,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    positions: data,
    isLoading,
  };
};
