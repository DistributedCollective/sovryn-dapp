import { Decimal } from '@sovryn/utils';

import { Reserve } from '../../../../../../../hooks/aave/useAaveReservesData';

export const getCollateralRatioThresholds = (
  reserve: Reserve | undefined,
  eModeEnabled: boolean,
) => {
  let minimumCollateralRatio: Decimal;
  if (reserve !== undefined) {
    minimumCollateralRatio = eModeEnabled
      ? Decimal.from(reserve.formattedEModeLiquidationThreshold)
      : Decimal.from(reserve.formattedReserveLiquidationThreshold);
  } else {
    minimumCollateralRatio = Decimal.from(1);
  }

  const threeholds = {
    START: minimumCollateralRatio.mul(0.9).toNumber(),
    MIDDLE_START: minimumCollateralRatio.toNumber(),
    MIDDLE_END: minimumCollateralRatio.mul(1.2).toNumber(),
    END: minimumCollateralRatio.mul(1.6).toNumber(),
  };

  // rule of 3 basically END -> 100; {} -> x => x = {} * 100 / END
  const scalingFactor = 100 / threeholds.END;

  return {
    START: threeholds.START * scalingFactor,
    MIDDLE_START: threeholds.MIDDLE_START * scalingFactor,
    MIDDLE_END: threeholds.MIDDLE_END * scalingFactor,
    END: 100,
  };
};
