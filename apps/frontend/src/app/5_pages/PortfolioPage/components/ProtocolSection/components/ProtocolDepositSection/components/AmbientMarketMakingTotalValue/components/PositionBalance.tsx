import { FC, useEffect } from 'react';

import { Pool } from '@sovryn/sdk';
import { Decimal } from '@sovryn/utils';

import { AmbientPosition } from '../../../../../../../../MarketMakingPage/components/AmbientMarketMaking/AmbientMarketMaking.types';
import { useAmbientPositionValue } from '../../../../../../../../MarketMakingPage/components/AmbientMarketMaking/components/AmbientPoolPositions/hooks/useAmbientPositionValue';

type PositionBalanceProps = {
  position: AmbientPosition;
  pool: Pool;
  onBalanceChange: (balanceToAdd: Decimal, position: AmbientPosition) => void;
};

export const PositionBalance: FC<PositionBalanceProps> = ({
  position,
  pool,
  onBalanceChange,
}) => {
  const value = useAmbientPositionValue(pool, position);

  useEffect(() => {
    if (value) {
      onBalanceChange(Decimal.from(value), position);
    }
  }, [value, onBalanceChange, position]);

  return null;
};
