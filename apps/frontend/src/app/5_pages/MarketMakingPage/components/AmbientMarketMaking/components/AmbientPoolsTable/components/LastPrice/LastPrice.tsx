import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { decimalic } from '../../../../../../../../../utils/math';
import { useGetPoolInfo } from '../../../../../BobDepositModal/hooks/useGetPoolInfo';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type LastPriceProps = {
  pool: AmbientLiquidityPool;
};

export const LastPrice: FC<LastPriceProps> = ({ pool }) => {
  const { price } = useGetPoolInfo(pool.base, pool.quote);

  return <AmountRenderer value={decimalic(price)} suffix={pool.quote} />;
};
