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
  ZERO_CONVERT_SRC_MOC = 'zeroConvertSrcMOC',
  ZERO_CONVERT_SRC_MYNT = 'zeroConvertSrcMYNT',
  ZERO_CONVERT_SRC_SOV = 'zeroConvertSrcSOV',
  ZERO_CONVERT_SRC_BNBSRBTC = 'zeroConvertSrcSOV_BNBSRBTC',
  ZERO_CONVERT_SRC_DLLRRBTC = 'zeroConvertSrcSOV_DLLRRBTC',
  ZERO_CONVERT_SRC_ETHSRBTC = 'zeroConvertSrcSOV_ETHSRBTC',
  ZERO_CONVERT_SRC_FISHRBTC = 'zeroConvertSrcSOV_FISHRBTC',
  ZERO_CONVERT_SRC_MOCRBTC = 'zeroConvertSrcSOV_MOCRBTC',
  ZERO_CONVERT_SRC_RIFRBTC = 'zeroConvertSrcSOV_RIFRBTC',
  ZERO_CONVERT_SRC_SOVRBTC = 'zeroConvertSrcSOV_SOVRBTC',
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
  REWARDS_FULL = 'rewardsFull',
  REWARDS_STAKING = 'rewardsStaking',

  STAKING_FULL = 'stakingFull',
  STAKING_STAKE_SOV = 'stakingStakeSOV',
  STAKING_NEW = 'stakingNew',
  STAKING_INCREASE = 'stakingIncrease',
  STAKING_EXTEND = 'stakingExtend',
  STAKING_DECREASE = 'stakingDecrease',
  STAKING_DELEGATE = 'stakingVestingDelegate',

  BORROW_FULL = 'borrow_Full',
  D2_BORROW_BTC_NEW_LOANS = 'd2BorrowBTC_NewLoans',
  D2_BORROW_BTC_BORROW = 'd2BorrowBTC_Borrow',
  D2_BORROW_BTC_REPAY = 'd2BorrowBTC_Repay',
  D2_BORROW_BTC_CLOSE = 'd2BorrowBTC_Close',
  D2_BORROW_BTC_ADD_COLLATERAL = 'd2BorrowBTC_addCollateral',
  D2_BORROW_BTC_WITHDRAW_COLLATERAL = 'd2BorrowBTC_withdrawCollateral',
  D2_BORROW_DLLR_NEW_LOANS = 'd2BorrowDLLR_NewLoans',
  D2_BORROW_DLLR_BORROW = 'd2BorrowDLLR_Borrow',
  D2_BORROW_DLLR_REPAY = 'd2BorrowDLLR_Repay',
  D2_BORROW_DLLR_CLOSE = 'd2BorrowDLLR_Close',
  D2_BORROW_DLLR_ADD_COLLATERAL = 'd2BorrowDLLR_addCollateral',
  D2_BORROW_DLLR_WITHDRAW_COLLATERAL = 'd2BorrowDLLR_withdrawCollateral',
  D2_BORROW_XUSD_NEW_LOANS = 'd2BorrowXUSD_NewLoans',
  D2_BORROW_XUSD_BORROW = 'd2BorrowXUSD_Borrow',
  D2_BORROW_XUSD_REPAY = 'd2BorrowXUSD_Repay',
  D2_BORROW_XUSD_CLOSE = 'd2BorrowXUSD_Close',
  D2_BORROW_XUSD_ADD_COLLATERAL = 'd2BorrowXUSD_addCollateral',
  D2_BORROW_XUSD_WITHDRAW_COLLATERAL = 'd2BorrowXUSD_withdrawCollateral',
  D2_BORROW_DOC_NEW_LOANS = 'd2BorrowDOC_NewLoans',
  D2_BORROW_DOC_BORROW = 'd2BorrowDOC_Borrow',
  D2_BORROW_DOC_REPAY = 'd2BorrowDOC_Repay',
  D2_BORROW_DOC_CLOSE = 'd2BorrowDOC_Close',
  D2_BORROW_DOC_ADD_COLLATERAL = 'd2BorrowDOC_addCollateral',
  D2_BORROW_DOC_WITHDRAW_COLLATERAL = 'd2BorrowDOC_withdrawCollateral',
  D2_BORROW_USDT_NEW_LOANS = 'd2BorrowUSDT_NewLoans',
  D2_BORROW_USDT_BORROW = 'd2BorrowUSDT_Borrow',
  D2_BORROW_USDT_REPAY = 'd2BorrowUSDT_Repay',
  D2_BORROW_USDT_CLOSE = 'd2BorrowUSDT_Close',
  D2_BORROW_USDT_ADD_COLLATERAL = 'd2BorrowUSDT_addCollateral',
  D2_BORROW_USDT_WITHDRAW_COLLATERAL = 'd2BorrowUSDT_withdrawCollateral',
  D2_BORROW_BPRO_NEW_LOANS = 'd2BorrowBPRO_NewLoans',
  D2_BORROW_BPRO_BORROW = 'd2BorrowBPRO_Borrow',
  D2_BORROW_BPRO_REPAY = 'd2BorrowBPRO_Repay',
  D2_BORROW_BPRO_CLOSE = 'd2BorrowBPRO_Close',
  D2_BORROW_BPRO_ADD_COLLATERAL = 'd2BorrowBPRO_addCollateral',
  D2_BORROW_BPRO_WITHDRAW_COLLATERAL = 'd2BorrowBPRO_withdrawCollateral',
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
