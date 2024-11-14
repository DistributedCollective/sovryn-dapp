import React, { FC } from 'react';

import { Pool } from '@sovryn/sdk';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { decimalic } from '../../../../../../../../../utils/math';
import { useGetPoolInfo } from '../../../../../BobDepositModal/hooks/useGetPoolInfo';

type LastPriceProps = {
  pool: Pool;
};

export const LastPrice: FC<LastPriceProps> = ({ pool }) => {
  const { price } = useGetPoolInfo(pool);

  return <AmountRenderer value={decimalic(price)} suffix={pool.quote.symbol} />;
};
