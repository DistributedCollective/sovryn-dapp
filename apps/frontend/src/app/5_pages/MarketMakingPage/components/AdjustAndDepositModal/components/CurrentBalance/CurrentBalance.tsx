import React, { FC } from 'react';

import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { renderTokenSymbol } from '../../../../../../../utils/helpers';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';

type CurrentBalanceProps = {
  pool: AmmLiquidityPool;
  balanceA: Decimal;
  balanceB: Decimal;
};

export const CurrentBalance: FC<CurrentBalanceProps> = ({
  pool,
  balanceA,
  balanceB,
}) => (
  <>
    <div className="leading-none">
      {
        <AmountRenderer
          value={balanceA}
          suffix={renderTokenSymbol(pool.assetA)}
          precision={TOKEN_RENDER_PRECISION}
        />
      }
    </div>
    <div className="leading-none">
      {
        <AmountRenderer
          value={balanceB}
          suffix={BITCOIN}
          precision={BTC_RENDER_PRECISION}
        />
      }
    </div>
  </>
);
