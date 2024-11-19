import React, { FC } from 'react';

import { numberToChainId } from '@sovryn/ethers-provider';
import { Pool } from '@sovryn/sdk';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../../../../../constants/tokens';
import { decimalic } from '../../../../../../../../../utils/math';

type AmbientPoolLiquidityProps = {
  pool: Pool;
};

export const AmbientPoolLiquidity: FC<AmbientPoolLiquidityProps> = ({
  pool,
}) => (
  <div className="inline-flex flex-col gap-0.5">
    <AmountRenderer
      value={decimalic(pool.baseLiquidity)}
      suffix={getTokenDisplayName(
        pool.base.symbol,
        numberToChainId(pool.chainId),
      )}
      precision={TOKEN_RENDER_PRECISION}
    />
    <AmountRenderer
      value={decimalic(pool.quoteLiquidity)}
      suffix={getTokenDisplayName(
        pool.quote.symbol,
        numberToChainId(pool.chainId),
      )}
      precision={TOKEN_RENDER_PRECISION}
    />
  </div>
);
