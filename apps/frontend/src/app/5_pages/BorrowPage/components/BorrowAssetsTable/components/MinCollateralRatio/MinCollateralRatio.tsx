import React, { FC, useMemo } from 'react';

import { useGetTokenContract } from '../../../../../../../hooks/useGetContract';
import { LendingPool } from '../../../../../../../utils/LendingPool';
import { useGetMinCollateralRatio } from '../../../../hooks/useGetMinCollateralRatio';

type MinCollateralRatioProps = {
  pool: LendingPool;
};

export const MinCollateralRatio: FC<MinCollateralRatioProps> = ({ pool }) => {
  const borrowToken = useMemo(() => pool.getAsset(), [pool]);
  const assetContract = useGetTokenContract(borrowToken);
  const maintenanceMargin = useGetMinCollateralRatio(assetContract?.address);

  return <div>{maintenanceMargin.mul(100).toString()}%</div>;
};
