import { useCallback, useMemo } from 'react';

import { useMaintenanceModeContext } from '../contexts/MaintenanceModeContext';
import { MaintenanceStates } from '../types/maintenanceState';
import { isStaging } from '../utils/helpers';

enum States {
  // D1 states left here for reference
  FULL = 'full',
  OPEN_MARGIN_TRADES = 'openMarginTrades',
  ADD_TO_MARGIN_TRADES = 'addToMarginTrades',
  CLOSE_MARGIN_TRADES = 'closeMarginTrades',
  MARGIN_LIMIT = 'openMarginLimit',
  CLOSE_MARGIN_LIMIT = 'closeMarginLimit',
  SPOT_TRADES = 'spotTrades',
  SPOT_LIMIT = 'openSpotLimit',
  CLOSE_SPOT_LIMIT = 'closeSpotLimit',
  SWAP_TRADES = 'swapTrades',
  DEPOSIT_LEND = 'depositLend',
  WITHDRAW_LEND = 'withdrawLend',
  START_BORROW = 'startBorrow',
  STOP_BORROW = 'stopBorrow',
  ADD_LIQUIDITY = 'addLiquidity',
  REMOVE_LIQUIDITY = 'removeLiquidity',
  TRANSAK = 'transak',

  BRIDGE = 'bridge',
  ETH_BRIDGE = 'ethBridge',
  BSC_BRIDGE = 'bscBridge',
  ETH_BRIDGE_DEPOSIT = 'ethBridgeDeposit',
  ETH_BRIDGE_WITHDRAW = 'ethBridgeWithdraw',
  BSC_BRIDGE_DEPOSIT = 'bscBridgeDeposit',
  BSC_BRIDGE_WITHDRAW = 'bscBridgeWithdraw',
  BRIDGE_SOV_DEPOSIT = 'bridgeSOVDeposit',
  BRIDGE_SOV_WITHDRAW = 'bridgeSOVWithdraw',
  BRIDGE_XUSD_DEPOSIT = 'bridgeXUSDDeposit',
  BRIDGE_XUSD_WITHDRAW = 'bridgeXUSDWithdraw',
  BRIDGE_ETH_DEPOSIT = 'bridgeETHDeposit',
  BRIDGE_ETH_WITHDRAW = 'bridgeETHWithdraw',
  BRIDGE_BNB_DEPOSIT = 'bridgeBNBDeposit',
  BRIDGE_BNB_WITHDRAW = 'bridgeBNBWithdraw',

  STAKING = 'staking',
  UNSTAKING = 'unstaking',
  WITHDRAW_FEES = 'withdrawEarnedFees',
  DELEGATE_STAKES = 'delegateStakes',
  DELEGATE_VESTS = 'delegateVests',
  WITHDRAW_VESTS = 'withdrawVests',

  CLAIM_REWARDS = 'claimRewards',
  CLAIM_REWARD_SOV = 'claimRewardSov',
  CLAIM_LIQUID_SOV = 'claimLiquidSov',
  CLAIM_FEES_EARNED = 'claimFeesEarned',

  PERPETUALS = 'perpetuals',
  PERPETUALS_ACCOUNT_FUND = 'perpetualsAccountFund',
  PERPETUALS_ACCOUNT_WITHDRAW = 'perpetualsAccountWithdraw',
  PERPETUALS_ACCOUNT_TRANSFER = 'perpetualsAccountTransfer',
  PERPETUALS_TRADE = 'perpetualsTrade',
  PERPETUALS_GSN = 'perpetualsGsn',

  // D2 states
  FULLD2 = 'fullD2',
  FASTBTC_SEND = 'fastBTCSend', // shared between D1 and D2
  FASTBTC_RECEIVE = 'fastBTCReceive', // shared between D1 and D2
  ZERO_CONVERT = 'zeroConvert',
  ZERO_OPEN_LOC = 'zeroOpenLOC',
  ZERO_ADJUST_LOC = 'zeroAdjustLOC',
  ZERO_ADJUST_LOC_BORROW = 'zeroAdjustLOCBorrow',
  ZERO_CLOSE_LOC = 'zeroCloseLOC',
  ZERO_STABILITY_ADD = 'zeroStabilityAdd',
  ZERO_STABILITY_REMOVE = 'zeroStabilityRemove',
  ZERO_STABILITY_CLAIM = 'zeroStabilityClaim',
  ZERO_REDEMPTIONS = 'zeroRedemptions',
  ZERO_DLLR = 'zeroDLLR',
  ZERO_EXPORT_CSV = 'zeroExportCSV',
}

type MaintenanceResult = {
  [key in States]: boolean;
};

export function useMaintenance() {
  const maintenanceStates: MaintenanceStates = useMaintenanceModeContext();

  const checkMaintenance = useCallback(
    (...names: States[]): boolean => {
      if (process.env.REACT_APP_BYPASS_MAINTENANCE === 'true' || isStaging()) {
        return false;
      }
      return names.every(
        // assume we are in maintenance if states aren't retrieved (e.g. maintenance service unavailable)
        name => maintenanceStates[name]?.isInMaintenance ?? true,
      );
    },
    [maintenanceStates],
  );

  const checkMaintenances = useCallback((): MaintenanceResult => {
    return Object.keys(maintenanceStates).reduce(
      (res, curr) =>
        Object.assign(res, {
          [curr]: checkMaintenance(curr as States),
        }),
      {} as MaintenanceResult,
    );
  }, [checkMaintenance, maintenanceStates]);

  return useMemo(
    () => ({ checkMaintenance, checkMaintenances, States }),
    [checkMaintenance, checkMaintenances],
  );
}
