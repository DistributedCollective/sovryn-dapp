import React, { FC } from 'react';

import { Pool } from '@sovryn/sdk';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { useAmbientPositionValue } from '../../hooks/useAmbientPositionValue';

type AmbientPositionValueProps = {
  pool: Pool;
  position: AmbientPosition;
};

export const AmbientPositionValue: FC<AmbientPositionValueProps> = ({
  position,
  pool,
}) => {
  const value = useAmbientPositionValue(pool, position);

  if (value == null) {
    return null;
  }

  return (
    <div className="inline-flex flex-col">
      <AmountRenderer value={value} asIf />
    </div>
  );
};
