import React, { FC } from 'react';

import axios from 'axios';

import { RSK_CHAIN_ID } from '../../../../../../../config/chains';

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
  const { value } = useCacheCall(
    `amm/pool-balance/${pool.converter}`,
    RSK_CHAIN_ID,
    async () => {
      try {
        const { data } = await axios.get<AmmBalanceRow>(
          `${getAmmServiceUrl()}amm/pool-balance/${pool.converter}`,
        );
        return data;
      } catch (error) {
        console.error('pool-balance: ', error);
        return null;
      }
    },
    [],
  );

  if (!value) {
    return null;
  }

  return (
    <div className="flex-col flex font-medium gap-0.5">
      <AmountRenderer
        value={value.contractBalanceToken}
        suffix={getTokenDisplayName(pool.assetA)}
        precision={TOKEN_RENDER_PRECISION}
      />
      <AmountRenderer
        value={value.contractBalanceBtc}
        suffix={BITCOIN}
        precision={BTC_RENDER_PRECISION}
      />
    </div>
  );
};
