import React, { FC } from 'react';

import { Pool } from '@sovryn/sdk';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../../../../constants/currencies';
import { decimalic } from '../../../../../../../../../utils/math';

type AmbientPool24VolumeProps = {
  pool: Pool;
};

export const AmbientPool24Volume: FC<AmbientPool24VolumeProps> = ({ pool }) => {
  return (
    <div className="inline-flex flex-col gap-0.5">
      <AmountRenderer
        value={decimalic(pool.dailyBaseVolume)}
        suffix={pool.base.symbol}
        precision={TOKEN_RENDER_PRECISION}
      />
      <AmountRenderer
        value={decimalic(pool.dailyQuoteVolume)}
        suffix={pool.quote.symbol}
        precision={TOKEN_RENDER_PRECISION}
      />
    </div>
  );
};
