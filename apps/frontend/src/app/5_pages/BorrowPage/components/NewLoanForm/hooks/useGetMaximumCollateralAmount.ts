import { useMemo } from 'react';

import { Decimal } from '@sovryn/utils';

import { useMaxAssetBalance } from '../../../../../../hooks/useMaxAssetBalance';
import { useGetOriginationFee } from '../../../hooks/useGetOriginationFee';

export const useGetMaximumCollateralAmount = (
  asset: string,
  currentCollateral?: Decimal,
) => {
  const { weiBalance: assetBalance, loading } = useMaxAssetBalance(asset);

  const originationFeeRate = useGetOriginationFee();

  const collateralAmount = useMemo(
    () =>
      Decimal.fromBigNumberString(assetBalance).add(
        currentCollateral ? currentCollateral : Decimal.ZERO,
      ),
    [assetBalance, currentCollateral],
  );

  const result = useMemo(
    () =>
      loading
        ? Decimal.ZERO
        : collateralAmount.mul(Decimal.ONE.sub(originationFeeRate.div(100))),
    [collateralAmount, loading, originationFeeRate],
  );

  return { maximumCollateralAmount: result, loading };
};
