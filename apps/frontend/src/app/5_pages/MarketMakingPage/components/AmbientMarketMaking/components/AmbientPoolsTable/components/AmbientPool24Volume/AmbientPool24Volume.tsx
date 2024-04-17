import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../../../../../constants/tokens';
import { decimalic, fromWei } from '../../../../../../../../../utils/math';
import { useGetAmbientPool24Volume } from '../../../../hooks/useGetAmbientPool24Volume';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type AmbientPool24VolumeProps = {
  pool: AmbientLiquidityPool;
};

export const AmbientPool24Volume: FC<AmbientPool24VolumeProps> = ({ pool }) => {
  const { data } = useGetAmbientPool24Volume(pool);

  return (
    <div className="flex flex-col gap-0.5">
      <AmountRenderer
        value={fromWei(decimalic(data?.volumeBase || 0).toString())}
        suffix={getTokenDisplayName(pool.base, pool.chainId)}
        precision={TOKEN_RENDER_PRECISION}
      />
      <AmountRenderer
        value={fromWei(decimalic(data?.volumeQuote || 0).toString())}
        suffix={getTokenDisplayName(pool.quote, pool.chainId)}
        precision={TOKEN_RENDER_PRECISION}
      />
    </div>
  );
};
