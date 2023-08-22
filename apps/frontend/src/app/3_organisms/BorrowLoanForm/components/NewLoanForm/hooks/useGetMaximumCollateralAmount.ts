import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { useLiquityBaseParams } from '../../../../../5_pages/ZeroPage/hooks/useLiquityBaseParams';
import { useMaxAssetBalance } from '../../../../../../hooks/useMaxAssetBalance';

const BTC_GAS_FEE = 0.000402832;

export const useGetMaximumCollateralAmount = (asset: SupportedTokens) => {
  const { weiBalance: assetBalance, loading } = useMaxAssetBalance(asset);
  const { minBorrowingFeeRate } = useLiquityBaseParams();

  const collateralAmount = useMemo(
    () => Decimal.fromBigNumberString(assetBalance),
    [assetBalance],
  );

  const balance = useMemo(
    () =>
      asset === SupportedTokens.rbtc
        ? collateralAmount.sub(BTC_GAS_FEE)
        : collateralAmount,
    [asset, collateralAmount],
  );

  const originationFeeRate = useMemo(
    () => minBorrowingFeeRate.div(100),
    [minBorrowingFeeRate],
  );

  const result = useMemo(
    () =>
      loading ? Decimal.ZERO : balance.mul(Decimal.ONE.sub(originationFeeRate)),
    [balance, loading, originationFeeRate],
  );

  return result;
};
