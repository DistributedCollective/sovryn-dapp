import { useMemo } from 'react';

import { useMaintenance } from '../../../../hooks/useMaintenance';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const useCheckPoolMaintenance = (pool: AmmLiquidityPool) => {
  const { States, checkMaintenance } = useMaintenance();

  return useMemo(() => {
    switch (pool.assetA) {
      case 'DLLR':
        return checkMaintenance(States.D2_MARKET_MAKING_DLLR);
      case 'FISH':
        return checkMaintenance(States.D2_MARKET_MAKING_FISH);
      case 'MOC':
        return checkMaintenance(States.D2_MARKET_MAKING_MOC);
      case 'MYNT':
        return checkMaintenance(States.D2_MARKET_MAKING_MYNT);
      case 'RIF':
        return checkMaintenance(States.D2_MARKET_MAKING_RIF);
      case 'SOV':
        return checkMaintenance(States.D2_MARKET_MAKING_SOV);
      default:
        return false;
    }
  }, [
    States.D2_MARKET_MAKING_DLLR,
    States.D2_MARKET_MAKING_FISH,
    States.D2_MARKET_MAKING_MOC,
    States.D2_MARKET_MAKING_MYNT,
    States.D2_MARKET_MAKING_RIF,
    States.D2_MARKET_MAKING_SOV,
    checkMaintenance,
    pool.assetA,
  ]);
};
