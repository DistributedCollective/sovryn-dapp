import React, { useEffect } from 'react';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useFetch } from '../../../../hooks/useFetch';
import { useGetLiquidityMiningAllocationPointsQuery } from '../../../../utils/graphql/rsk/generated';
import {
  PLACEHOLDER_PROMOTION,
  BLOCKS_PER_WEEK,
  MINIMUM_REWARD,
  AMM_SERVICE_URL,
} from '../MarketMakingPage.constants';
import {
  PromotionsDataResponse,
  PromotionData,
} from '../MarketMakingPage.types';
import { getAmmHistory } from '../MarketMakingPage.utils';
import { AmmLiquidityPoolDictionary } from '../utils/AmmLiquidityPoolDictionary';

export const useGetPromotionsData = (): PromotionsDataResponse => {
  const { value: ammData } = useFetch(`${AMM_SERVICE_URL[RSK_CHAIN_ID]}/amm`);

  const [promotionData, setPromotionData] = React.useState<PromotionData[]>([]);

  const { data, loading } = useGetLiquidityMiningAllocationPointsQuery();

  useEffect(() => {
    if (data && !loading) {
      const promotionData: PromotionData[] =
        data.liquidityMiningAllocationPoints.map(item => {
          let rewardAmount = Math.floor(
            parseFloat(item.rewardPerBlock) * BLOCKS_PER_WEEK,
          );

          const pool = AmmLiquidityPoolDictionary.get(item.id); // TODO: Needs to be adjusted in the future if we want to dynamically display Lending promotions as well

          // We need to round rewards to the nearest 100
          if (rewardAmount % 100 !== 0) {
            const remainder = rewardAmount % 100;

            if (remainder < 50) {
              rewardAmount = rewardAmount - remainder;
            } else {
              rewardAmount = rewardAmount + (100 - remainder);
            }
          }

          if (!pool) {
            return PLACEHOLDER_PROMOTION;
          }

          const ammHistory = getAmmHistory(ammData, pool.assetA, pool.assetB);

          const apy =
            ammHistory?.data[item.id][ammHistory?.data[item.id].length - 1]
              .APY_pc;

          return {
            rewardAmount,
            type: 'AMM',
            poolTokenA: item.id,
            asset1: pool.assetA,
            asset2: pool.assetB,
            linkAsset: pool.key,
            ammData: ammHistory,
            apy,
            pool,
          };
        });

      const filteredPromotionData = promotionData.filter(
        item => item.rewardAmount >= MINIMUM_REWARD && item.poolTokenA !== '',
      );

      if (filteredPromotionData.length > 0) {
        setPromotionData(
          filteredPromotionData.sort((a, b) => b.rewardAmount - a.rewardAmount),
        );
      }
    }
  }, [ammData, data, loading]);

  return { data: promotionData, loading };
};
