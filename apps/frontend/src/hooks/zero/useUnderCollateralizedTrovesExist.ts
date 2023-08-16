import { useEffect, useState } from 'react';

import {
  CRITICAL_COLLATERAL_RATIO,
  MINIMUM_COLLATERAL_RATIO,
} from '../../app/3_organisms/ZeroLocForm/constants';
import { GetTrovesQuery } from '../../utils/graphql/zero/generated';
import { calculateCollateralRatio } from '../../utils/helpers';
import { decimalic } from '../../utils/math';
import { useGetRBTCPrice } from './useGetRBTCPrice';
import { useIsSystemInRecoveryMode } from './useIsSystemInRecoveryMode';

export const useUnderCollateralizedTrovesExist = (troves?: GetTrovesQuery) => {
  const isInRecoveryMode = useIsSystemInRecoveryMode();
  const { price } = useGetRBTCPrice();

  const [isUnderCollateralized, setIsUnderCollateralized] = useState(false);

  useEffect(() => {
    if (troves?.troves) {
      const isLowTroveExists = troves.troves.reduce(
        (acc, { collateral, debt }) => {
          const collateralRatio = calculateCollateralRatio(
            decimalic(collateral),
            decimalic(debt),
            decimalic(price),
          );

          const isRatioBelowThreshold = isInRecoveryMode
            ? collateralRatio.lt(CRITICAL_COLLATERAL_RATIO.mul(100))
            : collateralRatio.lt(MINIMUM_COLLATERAL_RATIO.mul(100));

          return acc || isRatioBelowThreshold;
        },
        false,
      );

      setIsUnderCollateralized(isLowTroveExists);
    }
  }, [isInRecoveryMode, price, troves?.troves]);

  return isUnderCollateralized;
};
