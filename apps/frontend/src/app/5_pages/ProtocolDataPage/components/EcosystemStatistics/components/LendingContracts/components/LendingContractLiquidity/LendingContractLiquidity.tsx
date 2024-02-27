import { FC, useEffect, useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { useQueryRate } from '../../../../../../../../../hooks/useQueryRate';
import { LendingPool } from '../../../../../../../../../utils/LendingPool';
import { decimalic } from '../../../../../../../../../utils/math';
import { useGetMarketLiquidity } from '../../../../../../../LendPage/components/LendFrame/components/LendFrameDetails/hooks/useGetMarketLiquidity';
import { useGetTotalAssetBorrow } from '../../../../../../../LendPage/components/LendFrame/components/LendFrameDetails/hooks/useGetTotalAssetBorrow';

type LendingContractLiquidityProps = {
  pool: LendingPool;
  onChange: (asset: SupportedTokens, balance: Decimal) => void;
};

export const LendingContractLiquidity: FC<LendingContractLiquidityProps> = ({
  pool,
  onChange,
}) => {
  const asset = useMemo(() => pool.getAsset(), [pool]);
  const [rate] = useQueryRate(asset, SupportedTokens.rbtc);

  const { borrowedAmount } = useGetTotalAssetBorrow(asset);
  const { availableAmount } = useGetMarketLiquidity(asset);

  const totalLiquidity = useMemo(
    () => decimalic(availableAmount).add(borrowedAmount).mul(rate),
    [availableAmount, borrowedAmount, rate],
  );

  useEffect(() => {
    onChange(asset, totalLiquidity);
  }, [totalLiquidity, onChange, asset]);

  return null;
};
