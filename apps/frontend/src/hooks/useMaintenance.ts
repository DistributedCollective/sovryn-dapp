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
  ZERO_CONVERT_SRC_BNBSRBTC = 'zeroConvertSrcSOVxBNBSRBTC',
  ZERO_CONVERT_SRC_DLLRRBTC = 'zeroConvertSrcSOVxDLLRRBTC',
  ZERO_CONVERT_SRC_ETHSRBTC = 'zeroConvertSrcSOVxETHSRBTC',
  ZERO_CONVERT_SRC_FISHRBTC = 'zeroConvertSrcSOVxFISHRBTC',
  ZERO_CONVERT_SRC_MOCRBTC = 'zeroConvertSrcSOVxMOCRBTC',
  ZERO_CONVERT_SRC_RIFRBTC = 'zeroConvertSrcSOVxRIFRBTC',
  ZERO_CONVERT_SRC_SOVRBTC = 'zeroConvertSrcSOVxSOVRBTC',
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

  BORROW_FULL = 'borrowFull',
  D2_BORROW_BTC_NEW_LOANS = 'd2BorrowBTCxNewLoans',
  D2_BORROW_BTC_BORROW = 'd2BorrowBTCxBorrow',
  D2_BORROW_BTC_REPAY = 'd2BorrowBTCxRepay',
  D2_BORROW_BTC_CLOSE = 'd2BorrowBTCxClose',
  D2_BORROW_BTC_EXTEND = 'd2BorrowBTCxExtend',
  D2_BORROW_BTC_ADD_COLLATERAL = 'd2BorrowBTCxAddCollateral',
  D2_BORROW_BTC_WITHDRAW_COLLATERAL = 'd2BorrowBTCxWithdrawCollateral',
  D2_BORROW_DLLR_NEW_LOANS = 'd2BorrowDLLRxNewLoans',
  D2_BORROW_DLLR_BORROW = 'd2BorrowDLLRxBorrow',
  D2_BORROW_DLLR_REPAY = 'd2BorrowDLLRxRepay',
  D2_BORROW_DLLR_CLOSE = 'd2BorrowDLLRxClose',
  D2_BORROW_DLLR_EXTEND = 'd2BorrowDLLRxExtend',
  D2_BORROW_DLLR_ADD_COLLATERAL = 'd2BorrowDLLRxAddCollateral',
  D2_BORROW_DLLR_WITHDRAW_COLLATERAL = 'd2BorrowDLLRxWithdrawCollateral',
  D2_BORROW_XUSD_NEW_LOANS = 'd2BorrowXUSDxNewLoans',
  D2_BORROW_XUSD_BORROW = 'd2BorrowXUSDxBorrow',
  D2_BORROW_XUSD_REPAY = 'd2BorrowXUSDxRepay',
  D2_BORROW_XUSD_CLOSE = 'd2BorrowXUSDxClose',
  D2_BORROW_XUSD_EXTEND = 'd2BorrowXUSDxExtend',
  D2_BORROW_XUSD_ADD_COLLATERAL = 'd2BorrowXUSDxAddCollateral',
  D2_BORROW_XUSD_WITHDRAW_COLLATERAL = 'd2BorrowXUSDxWithdrawCollateral',
  D2_BORROW_DOC_NEW_LOANS = 'd2BorrowDOCxNewLoans',
  D2_BORROW_DOC_BORROW = 'd2BorrowDOCxBorrow',
  D2_BORROW_DOC_REPAY = 'd2BorrowDOCxRepay',
  D2_BORROW_DOC_CLOSE = 'd2BorrowDOCxClose',
  D2_BORROW_DOC_EXTEND = 'd2BorrowDOCxExtend',
  D2_BORROW_DOC_ADD_COLLATERAL = 'd2BorrowDOCxAddCollateral',
  D2_BORROW_DOC_WITHDRAW_COLLATERAL = 'd2BorrowDOCxWithdrawCollateral',
  D2_BORROW_USDT_NEW_LOANS = 'd2BorrowUSDTxNewLoans',
  D2_BORROW_USDT_BORROW = 'd2BorrowUSDTxBorrow',
  D2_BORROW_USDT_REPAY = 'd2BorrowUSDTxRepay',
  D2_BORROW_USDT_CLOSE = 'd2BorrowUSDTxClose',
  D2_BORROW_USDT_EXTEND = 'd2BorrowUSDTxExtend',
  D2_BORROW_USDT_ADD_COLLATERAL = 'd2BorrowUSDTxAddCollateral',
  D2_BORROW_USDT_WITHDRAW_COLLATERAL = 'd2BorrowUSDTxWithdrawCollateral',
  D2_BORROW_BPRO_NEW_LOANS = 'd2BorrowBPROxNewLoans',
  D2_BORROW_BPRO_BORROW = 'd2BorrowBPROxBorrow',
  D2_BORROW_BPRO_REPAY = 'd2BorrowBPROxRepay',
  D2_BORROW_BPRO_CLOSE = 'd2BorrowBPROxClose',
  D2_BORROW_BPRO_EXTEND = 'd2BorrowBPROxExtend',
  D2_BORROW_BPRO_ADD_COLLATERAL = 'd2BorrowBPROxAddCollateral',
  D2_BORROW_BPRO_WITHDRAW_COLLATERAL = 'd2BorrowBPROxWithdrawCollateral',

  D2_MARKET_MAKING_FULL = 'marketMakingFull',
  D2_MARKET_MAKING_DLLR = 'marketMakingDLLR',
  D2_MARKET_MAKING_SOV = 'marketMakingSOV',
  D2_MARKET_MAKING_FISH = 'marketMakingFISH',
  D2_MARKET_MAKING_MOC = 'marketMakingMOC',
  D2_MARKET_MAKING_RIF = 'marketMakingRIF',
  D2_MARKET_MAKING_MYNT = 'marketMakingMYNT',

  D2_RUNE_BRIDGE_RSK = 'd2RuneBridgeRSK',
  D2_RUNE_BRIDGE_BOB = 'd2RuneBridgeBOB',

  // BOB chain states
  BOB_FULL = 'fullD2Bob',
  BOB_DEPOSIT_LIQUIDITY = 'd2BobDepositLiquidity',
  BOB_WITHDRAW_LIQUIDITY = 'd2BobWithdrawLiquidity',
  BOB_CLAIM_AMM_FEES = 'd2BobClaimAMMFees',
  BOB_CLAIM_LP_DEPOSIT = 'd2BobClaimLPDeposit',
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
