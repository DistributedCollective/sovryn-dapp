import { useMemo } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useMaintenance } from '../../../../hooks/useMaintenance';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const useCheckPoolMaintenance = (pool: AmmLiquidityPool) => {
  const { States, checkMaintenance } = useMaintenance();

  return useMemo(() => {
    switch (pool.assetA) {
      case SupportedTokens.dllr:
        return checkMaintenance(States.D2_MARKET_MAKING_DLLR);
      case SupportedTokens.fish:
        return checkMaintenance(States.D2_MARKET_MAKING_FISH);
      case SupportedTokens.moc:
        return checkMaintenance(States.D2_MARKET_MAKING_MOC);
      case SupportedTokens.mynt:
        return checkMaintenance(States.D2_MARKET_MAKING_MYNT);
      case SupportedTokens.rif:
        return checkMaintenance(States.D2_MARKET_MAKING_RIF);
      case SupportedTokens.sov:
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
