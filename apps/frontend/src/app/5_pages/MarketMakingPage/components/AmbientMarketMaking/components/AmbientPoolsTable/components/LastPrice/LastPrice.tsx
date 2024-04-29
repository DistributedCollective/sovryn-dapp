import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useGetPoolInfo } from '../../../../../BobDepositModal/hooks/useGetPoolInfo';
import { useGetTokenDecimals } from '../../../../../BobWIthdrawModal/hooks/useGetTokenDecimals';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type LastPriceProps = {
  pool: AmbientLiquidityPool;
};

export const LastPrice: FC<LastPriceProps> = ({ pool }) => {
  const { spotPrice, poolTokens } = useGetPoolInfo(pool.base, pool.quote);

  const { quoteTokenDecimals } = useGetTokenDecimals(
    poolTokens?.tokenA,
    poolTokens?.tokenB,
  );

  return (
    <AmountRenderer
      value={spotPrice}
      suffix={pool.base}
      decimals={quoteTokenDecimals}
    />
  );
};
