import { FC, useEffect } from 'react';

import { Decimal } from '@sovryn/utils';

import { useGetUserInfo } from '../../../../../../../../MarketMakingPage/hooks/useGetUserInfo';
import { AmmLiquidityPool } from '../../../../../../../../MarketMakingPage/utils/AmmLiquidityPool';

type MarketMakingPoolBalanceProps = {
  pool: AmmLiquidityPool;
  onBalanceChange: (balanceToAdd: Decimal) => void;
  block: number;
};

export const MarketMakingPoolBalance: FC<MarketMakingPoolBalanceProps> = ({
  pool,
  onBalanceChange,
  block,
}) => {
  const { balanceB, refetch } = useGetUserInfo(pool);
  useEffect(() => {
    onBalanceChange(balanceB);
  }, [balanceB, onBalanceChange]);

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  return null;
};
