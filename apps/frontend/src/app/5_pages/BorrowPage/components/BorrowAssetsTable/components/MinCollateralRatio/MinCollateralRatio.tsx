import React, { FC, useMemo } from 'react';

import { LendingPool } from '../../../../../../../utils/LendingPool';
import { useGetMinCollateralRatio } from '../../../../hooks/useGetMinCollateralRatio';

type MinCollateralRatioProps = {
  pool: LendingPool;
};

export const MinCollateralRatio: FC<MinCollateralRatioProps> = ({ pool }) => {
  const borrowToken = useMemo(() => pool.getAsset(), [pool]);
  const maintenanceMargin = useGetMinCollateralRatio(borrowToken);

  return <div>{maintenanceMargin.mul(100).toString()}%</div>;
};
