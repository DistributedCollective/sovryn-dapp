import axios from 'axios';

import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useCacheCall } from '../../../../../../hooks';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useTokenDetailsByAsset } from '../../../../../../hooks/useTokenDetailsByAsset';
import { getIndexerUri } from '../../../../../../utils/indexer';
import { PoolPositionType } from '../../../MarketMakingPage.types';
import { AmbientPosition } from '../AmbientMarketMaking.types';
import { AmbientLiquidityPool } from '../utils/AmbientLiquidityPool';

export const useGetAmbientPositions = (pool: AmbientLiquidityPool) => {
  const { croc } = useCrocContext();
  const chainId = useCurrentChain();
  const { account } = useAccount();
  const baseToken = useTokenDetailsByAsset(pool.base, pool.chainId);
  const quoteToken = useTokenDetailsByAsset(pool.quote, pool.chainId);
  const { value: blockNumber } = useBlockNumber(chainId);

  const { value: positions, loading } = useCacheCall(
    `user-pools-balance/${pool.base}/${pool.quote}/${pool.poolIndex}/${account}`,
    chainId,
    async () => {
      if (!baseToken || !quoteToken || !account || !croc) {
        return [];
      }
      try {
        const { data } = await axios.get<any>(
          `${getIndexerUri(chainId)}/user_pool_positions?user=${account}&base=${
            baseToken?.address
          }&quote=${quoteToken?.address}&poolIdx=${pool.poolIndex}&chainId=${
            pool.chainId
          }`,
        );

        const positions = data.data as AmbientPosition[];

        if (pool.lpTokenAddress) {
          const wallet = await croc.token(pool.lpTokenAddress).wallet(account);
          if (wallet.gt(0)) {
            const ambientIndex = positions.findIndex(
              position => position.positionType === PoolPositionType.ambient,
            );

            if (ambientIndex !== -1) {
              const ambientPosition = positions[ambientIndex];
              ambientPosition.ambientLiq = wallet.toString() as any;
            } else {
              positions.push({
                chainId: pool.chainId,
                base: pool.base,
                quote: pool.quote,
                poolIdx: pool.poolIndex,
                bidTick: 0,
                askTick: 0,
                isBid: false,
                user: account,
                timeFirstMint: 0,
                latestUpdateTime: 0,
                lastMintTx: '',
                firstMintTx: '',
                positionType: PoolPositionType.ambient,
                ambientLiq: wallet.toString() as any,
                rewardLiq: 0,
                liqRefreshTime: 0,
                aprDuration: 0,
                aprPostLiq: 0,
                aprContributedLiq: 0,
                aprEst: 0,
                positionId: '',
              } as AmbientPosition);
            }
          }
        }

        const filteredPositions = positions.filter(
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
      pool.poolIndex,
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
