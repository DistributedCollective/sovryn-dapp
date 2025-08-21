import React, { FC, useEffect } from 'react';

import { useBlockNumber } from '../../../../../../../hooks/useBlockNumber';
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
  const { balanceA, balanceB, refetch } = useGetUserInfo(pool);
  const { value: block } = useBlockNumber();

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  return (
    <CurrentBalance
      pool={pool}
      balanceA={balanceA}
      balanceB={balanceB}
      showLabel={showLabel}
    />
  );
};
