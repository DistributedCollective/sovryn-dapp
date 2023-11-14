import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { renderTokenSymbol } from '../../../../../../../utils/helpers';
import { fromWei } from '../../../../../../../utils/math';
import { useGetUserInfo } from '../../../../hooks/useGetUserInfo';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';

type CurrentBalanceProps = {
  pool: AmmLiquidityPool;
};

export const CurrentBalance: FC<CurrentBalanceProps> = ({ pool }) => {
  const { balanceA, balanceB } = useGetUserInfo(pool);
  return (
    <>
      <div className="leading-none">
        {
          <AmountRenderer
            value={fromWei(balanceA.toString())}
            suffix={renderTokenSymbol(pool.assetA)}
            precision={TOKEN_RENDER_PRECISION}
          />
        }
      </div>
      <div className="leading-none">
        {
          <AmountRenderer
            value={fromWei(balanceB.toString())}
            suffix={BITCOIN}
            precision={BTC_RENDER_PRECISION}
          />
        }
      </div>
    </>
  );
};
