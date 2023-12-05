import React, { FC } from 'react';

import { useGetUserInfo } from '../../../../hooks/useGetUserInfo';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { CurrentBalance } from '../CurrentBalance/CurrentBalance';

type CurrentBalanceRendererProps = {
  pool: AmmLiquidityPool;
  showLabel?: boolean;
};

export const CurrentBalanceRenderer: FC<CurrentBalanceRendererProps> = ({
  pool,
  showLabel = false,
}) => {
  const { balanceA, balanceB } = useGetUserInfo(pool);

  return (
    <CurrentBalance
      pool={pool}
      balanceA={balanceA}
      balanceB={balanceB}
      showLabel={showLabel}
    />
  );
};
