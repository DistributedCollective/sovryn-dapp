import { FC, useEffect, useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { useGetPoolLiquidity } from '../../../../../../../MarketMakingPage/hooks/useGetPoolLiquidity';
import { AmmLiquidityPool } from '../../../../../../../MarketMakingPage/utils/AmmLiquidityPool';

type AmmContractLiquidityProps = {
  pool: AmmLiquidityPool;
  onChange: (asset: SupportedTokens, balance: Decimal) => void;
};

export const AmmContractLiquidity: FC<AmmContractLiquidityProps> = ({
  pool,
  onChange,
}) => {
  const { balanceTokenB } = useGetPoolLiquidity(pool);

  const asset = useMemo(() => pool.assetA, [pool]);

  useEffect(() => {
    onChange(asset, balanceTokenB);
  }, [balanceTokenB, onChange, asset]);

  return null;
};
