import { Decimal } from '@sovryn/utils';

import { Reserve } from '../../../../../hooks/aave/useAaveReservesData';

export const normalizeEModeStats = (reserve: Reserve) => ({
  label: reserve.eModeLabel,
  enabled: reserve.eModeCategoryId !== 0,
  ltv: Decimal.from(reserve.formattedEModeLtv).mul(100),
  liquidationThreshold: Decimal.from(
    reserve.formattedEModeLiquidationThreshold,
  ).mul(100),
  liquidationPenalty: Decimal.from(reserve.formattedEModeLiquidationBonus).mul(
    100,
  ),
});
