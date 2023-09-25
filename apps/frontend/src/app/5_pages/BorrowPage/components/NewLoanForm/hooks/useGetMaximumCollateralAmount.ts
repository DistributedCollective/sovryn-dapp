import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { useGetOriginationFee } from '../../../../../5_pages/BorrowPage/components/AdjustLoanForm/hooks/useGetOriginationFee';
import { useMaxAssetBalance } from '../../../../../../hooks/useMaxAssetBalance';

export const useGetMaximumCollateralAmount = (
  asset: SupportedTokens,
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
