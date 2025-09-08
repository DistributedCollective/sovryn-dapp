import React, { FC } from 'react';

import { Pool } from '@sovryn/sdk';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { decimalic } from '../../../../../../../../../utils/math';

type AmbientPoolFeeRateProps = {
  pool: Pool;
};

export const AmbientPoolFeeRate: FC<AmbientPoolFeeRateProps> = ({ pool }) => {
  return <AmountRenderer value={decimalic(pool.fee)} suffix="%" />;
};
