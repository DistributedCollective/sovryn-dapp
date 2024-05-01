import React, { FC, useMemo } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { TOKEN_RENDER_PRECISION } from '../../../../../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../../../../../constants/tokens';
import { findAsset } from '../../../../../../../../../utils/asset';
import { decimalic } from '../../../../../../../../../utils/math';
import { useGetAmbientPool24Volume } from '../../../../hooks/useGetAmbientPool24Volume';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type AmbientPool24VolumeProps = {
  pool: AmbientLiquidityPool;
};

export const AmbientPool24Volume: FC<AmbientPool24VolumeProps> = ({ pool }) => {
  const { data } = useGetAmbientPool24Volume(pool);
  const baseToken = useMemo(
    () => findAsset(pool.base, pool.chainId),
    [pool.base, pool.chainId],
  );
  const quoteToken = useMemo(
    () => findAsset(pool.quote, pool.chainId),
    [pool.quote, pool.chainId],
  );

  return (
    <div className="inline-flex flex-col gap-0.5">
      <AmountRenderer
        value={decimalic(data?.volumeBase || 0).toUnits(baseToken.decimals)}
        suffix={getTokenDisplayName(pool.base, pool.chainId)}
        precision={TOKEN_RENDER_PRECISION}
      />
      <AmountRenderer
        value={decimalic(data?.volumeQuote || 0).toUnits(quoteToken.decimals)}
        suffix={getTokenDisplayName(pool.quote, pool.chainId)}
        precision={TOKEN_RENDER_PRECISION}
        decimals={18}
      />
    </div>
  );
};
