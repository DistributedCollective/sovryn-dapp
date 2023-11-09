import React, { FC } from 'react';

import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { renderTokenSymbol } from '../../../../../../../utils/helpers';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';

const tokenBalance = Decimal.ZERO;
const rbtcBalance = Decimal.ZERO;

type CurrentBalanceProps = {
  pool: AmmLiquidityPool;
};

export const CurrentBalance: FC<CurrentBalanceProps> = ({ pool }) => (
  <>
    <div className="leading-none">
      {
        <AmountRenderer
          value={tokenBalance}
          suffix={renderTokenSymbol(pool.assetA)}
        />
      }
    </div>
    <div className="leading-none">
      {
        <AmountRenderer
          value={rbtcBalance}
          suffix={renderTokenSymbol(pool.assetB)}
        />
      }
    </div>
  </>
);
