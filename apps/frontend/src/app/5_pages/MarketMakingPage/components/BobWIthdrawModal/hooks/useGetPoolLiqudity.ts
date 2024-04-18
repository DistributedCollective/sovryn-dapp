import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import { useCrocContext } from '../../../../../../contexts/CrocContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { PoolPositionType } from '../../../MarketMakingPage.types';
import { useGetPoolInfo } from './useGetPoolInfo';

export const useGetPoolLiquidity = (
  tokenA: string,
  tokenB: string,
  positionType: PoolPositionType,
) => {
  const { account } = useAccount();
  const { croc } = useCrocContext();
  const { poolTokens } = useGetPoolInfo(tokenA, tokenB);
  const [liquidity, setCurrentLiquidity] = useState(BigNumber.from(0));

  const updateLiquidity = useCallback(async () => {
    if (!croc || !poolTokens || !account) {
      return;
    }
    try {
      const pos = croc.positions(
        poolTokens.tokenA.tokenAddr,
        poolTokens.tokenB.tokenAddr,
        account,
      );
      // TODO replace with actual tick values from the pool
      const lowerTick = -665454;
      const upperTick = 831818;
      const liqBigNum =
        positionType === PoolPositionType.concentrated
          ? (await pos.queryAmbient()).seeds
          : (await pos.queryRangePos(lowerTick, upperTick)).liq;
      setCurrentLiquidity(liqBigNum);
    } catch (error) {
      console.error(error);
    }
  }, [account, croc, poolTokens, positionType]);

  useEffect(() => {
    updateLiquidity();
  }, [updateLiquidity]);

  return { liquidity };
};
