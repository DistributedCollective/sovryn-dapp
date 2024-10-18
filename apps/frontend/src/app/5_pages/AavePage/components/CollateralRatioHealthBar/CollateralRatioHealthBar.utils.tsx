import { Decimal } from '@sovryn/utils';

export const getCollateralRatioThresholds = (minimum: Decimal) => {
  const minimumCollateralRatio = minimum.mul(100);

  return {
    START: 100,
    MIDDLE_START: minimumCollateralRatio.toNumber() - 0.1,
    MIDDLE_END: minimumCollateralRatio.mul(1.5).toNumber(),
    END: minimumCollateralRatio.mul(2).toNumber(),
  };
};
