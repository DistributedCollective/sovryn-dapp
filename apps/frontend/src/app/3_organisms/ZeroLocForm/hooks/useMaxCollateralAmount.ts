import { useMemo } from 'react';

import { fromWei } from '../../../../utils/math';

type UseMaxCollateralAmountProps = {
  isIncreasingCollateral: boolean;
  maxRbtcWeiBalance: string;
  existingCollateral: string;
};

export const useMaxCollateralAmount = (
  props: UseMaxCollateralAmountProps,
): number =>
  useMemo(() => {
    const { isIncreasingCollateral, maxRbtcWeiBalance, existingCollateral } =
      props;

    return Number(
      isIncreasingCollateral ? fromWei(maxRbtcWeiBalance) : existingCollateral,
    );
  }, [props]);
