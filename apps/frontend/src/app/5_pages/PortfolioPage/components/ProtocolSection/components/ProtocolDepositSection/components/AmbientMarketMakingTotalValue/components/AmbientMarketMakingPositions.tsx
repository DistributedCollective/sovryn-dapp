import React, { FC } from 'react';

import { Pool } from '@sovryn/sdk';
import { Decimal } from '@sovryn/utils';

import { AmbientPosition } from '../../../../../../../../MarketMakingPage/components/AmbientMarketMaking/AmbientMarketMaking.types';
import { useGetAmbientPositions } from '../../../../../../../../MarketMakingPage/components/AmbientMarketMaking/hooks/useGetAmbientPositions';
import { PositionBalance } from './PositionBalance';

type AmbientMarketMakingPositionsProps = {
  pool: Pool;
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
