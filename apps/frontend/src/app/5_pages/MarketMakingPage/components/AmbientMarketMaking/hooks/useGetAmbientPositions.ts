import axios from 'axios';

import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useCachedData } from '../../../../../../hooks/useCachedData';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { getSdexUri } from '../../../../../../utils/indexer';
import { PoolPositionType } from '../../../MarketMakingPage.types';
import { AmbientPosition } from '../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../utils/AmbientLiquidityPool';
import { useGetLpTokenBalance } from './useGetLpTokenBalance';

export const useGetAmbientPositions = (pool: AmbientLiquidityPool) => {
  const { croc } = useCrocContext();
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const baseToken = useTokenDetailsByAsset(pool.base, pool.chainId);
  const quoteToken = useTokenDetailsByAsset(pool.quote, pool.chainId);

  const lpTokenBalance = useGetLpTokenBalance(pool);

  const { value: positions, loading } = useCachedData(
    `user-pools-balance/${baseToken?.address}/${quoteToken?.address}/${
      pool.poolIndex
    }/${account}/${croc ? '' : 'croc'}`,
    chainId,
    async () => {
      if (
        !baseToken?.address ||
        !quoteToken?.address ||
        !account ||
        !croc ||
        !pool.poolIndex ||
        !pool.chainId
      ) {
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

        const positions = data.data as AmbientPosition[];

        if (pool.lpTokenAddress) {
          const wallet = await croc.token(pool.lpTokenAddress).wallet(account);
          const ambientIndex = positions.findIndex(
            position => position.positionType === PoolPositionType.ambient,
          );

          const liqBalance = wallet.gt(0) ? wallet.toString() : lpTokenBalance;

          if (ambientIndex !== -1) {
            const ambientPosition = positions[ambientIndex];
            ambientPosition.ambientLiq = liqBalance;
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
      } catch (error) {
        console.error('Error fetching positions:', error);
        return [];
      }
    },
    [
      baseToken?.address,
      quoteToken?.address,
      pool.poolIndex,
      account,
      chainId,
      lpTokenBalance,
    ],
    [],
  );

  return {
    positions,
    isLoading: loading,
  };
};
