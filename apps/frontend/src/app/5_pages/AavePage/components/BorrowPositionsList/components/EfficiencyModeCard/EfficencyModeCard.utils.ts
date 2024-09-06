import { ReservesDataHumanized } from '@aave/contract-helpers';
import { formatReserves, formatUserSummary } from '@aave/math-utils';

import { Decimal } from '@sovryn/utils';

import { UserReservesData } from '../../../../../../../types/aave';
import { AaveCalculations } from '../../../../../../../utils/aave/AaveCalculations';

export const normalizeEModeSummary = (
  eModeCategoryId: number,
  reservesData?: ReservesDataHumanized,
  userReservesData?: UserReservesData,
  timestamp?: number,
): {
  ltv: Decimal;
  collateralRatio: Decimal;
  liquidationRisk: boolean;
} => {
  if (!reservesData || !userReservesData || !timestamp) {
    return {
      ltv: Decimal.from(0),
      collateralRatio: Decimal.from(0),
      liquidationRisk: false,
    };
  }

  const {
    marketReferenceCurrencyDecimals,
    marketReferenceCurrencyPriceInUsd: marketReferencePriceInUsd,
  } = reservesData.baseCurrencyData;
  const summary = formatUserSummary({
    userEmodeCategoryId: eModeCategoryId,
    currentTimestamp: timestamp,
    marketReferencePriceInUsd,
    marketReferenceCurrencyDecimals,
    userReserves: userReservesData.userReserves,
    formattedReserves: formatReserves({
      currentTimestamp: timestamp,
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
      reserves: reservesData.reservesData,
    }),
  });

  // if health factor is below 1 we're at risk. Negative means doesn't apply
  const healthFactor = Decimal.from(summary.healthFactor);
  const liquidationRisk = healthFactor.lte(1) && healthFactor.gt(0);

  const collateralRatio = AaveCalculations.computeCollateralRatio(
    Decimal.from(summary.totalCollateralUSD),
    Decimal.from(summary.totalBorrowsUSD),
  );

  return {
    ltv: Decimal.from(summary.currentLoanToValue).mul(100),
    collateralRatio,
    liquidationRisk,
  };
};
