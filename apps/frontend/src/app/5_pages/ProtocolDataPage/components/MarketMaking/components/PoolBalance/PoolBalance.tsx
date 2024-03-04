import React, { FC } from 'react';

import axios from 'axios';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { getTokenDisplayName } from '../../../../../../../constants/tokens';
import { useCacheCall } from '../../../../../../../hooks';
import { getAmmServiceUrl } from '../../../../../../../utils/helpers';
import { AmmLiquidityPool } from '../../../../../MarketMakingPage/utils/AmmLiquidityPool';
import { AmmBalanceRow } from '../../MarketMaking.types';

type PoolBalanceProps = {
  pool: AmmLiquidityPool;
};

export const PoolBalance: FC<PoolBalanceProps> = ({ pool }) => {
  const { value: data } = useCacheCall(
    `amm/pool-balance/${pool.converter}`,
    async () => {
      try {
        const { data } = await axios.get<AmmBalanceRow>(
          `${getAmmServiceUrl()}amm/pool-balance/${pool.converter}`,
        );
        return data;
      } catch (error) {
        console.error('pool-balance: ', error);
      }
    },
    [],
  );

  if (!data) {
    return null;
  }

  return (
    <div className="flex-col flex font-medium gap-0.5">
      <AmountRenderer
        value={data.contractBalanceToken}
        suffix={getTokenDisplayName(pool.assetA)}
        precision={TOKEN_RENDER_PRECISION}
      />
      <AmountRenderer
        value={data.contractBalanceBtc}
        suffix={BITCOIN}
        precision={BTC_RENDER_PRECISION}
      />
    </div>
  );
};
