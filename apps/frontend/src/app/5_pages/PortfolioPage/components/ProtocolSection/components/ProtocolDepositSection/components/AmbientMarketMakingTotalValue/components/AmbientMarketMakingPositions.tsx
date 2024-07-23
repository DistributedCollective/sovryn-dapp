import React, { FC } from 'react';

import { Decimal } from '@sovryn/utils';

import { AmbientPosition } from '../../../../../../../../MarketMakingPage/components/AmbientMarketMaking/AmbientMarketMaking.types';
import { useGetAmbientPositions } from '../../../../../../../../MarketMakingPage/components/AmbientMarketMaking/hooks/useGetAmbientPositions';
import { AmbientLiquidityPool } from '../../../../../../../../MarketMakingPage/components/AmbientMarketMaking/utils/AmbientLiquidityPool';
import { PositionBalance } from './PositionBalance';

type AmbientMarketMakingPositionsProps = {
  pool: AmbientLiquidityPool;
  onBalanceChange: (balanceToAdd: Decimal, position: AmbientPosition) => void;
};

export const AmbientMarketMakingPositions: FC<
  AmbientMarketMakingPositionsProps
> = ({ pool, onBalanceChange }) => {
  const { positions } = useGetAmbientPositions(pool);
  return (
    <>
      {positions.map(position => (
        <PositionBalance
          key={position.transactionHash}
          position={position}
          pool={pool}
          onBalanceChange={onBalanceChange}
        />
      ))}
    </>
  );
};
