export const GAS_LIMIT = {
  MAX: 6_800_000,
  OPEN_TROVE: 1_200_000,
  ADJUST_TROVE: 4_000_000,
  CLOSE_TROVE: 350_000,
  CLOSE_DLLR_TROVE: 600_000,
  CONVERT: 750_000,
  STABILITY_POOL: 400_000,
  STABILITY_POOL_INC_WITHDRAW: 490_000,
  STABILITY_POOL_DLLR: 600_000,
  STABILITY_POOL_DLLR_INC_WITHDRAW: 690_000,
  REWARDS: 240_000,
  REWARDS_CLAIM: 6_800_000,
  REWARDS_OS_FEE: 600_000,
  TRANSFER_LOC: 900_000,
  LENDING_MINT: 350_000,
  // The fallback used only when a fresh gas estimate cannot be obtained —
  // see resolveGasLimit in TransactionStepDialog/utils.ts, which is what
  // sizes a real send. Set to the withdrawal delay's own cost through
  // ExitDelayQueue.recordERC20Exit plus the same 30% margin the estimator
  // applies to a live read, so a failed estimate still covers the
  // delay-armed case, not only the plain one.
  LENDING_BURN: 800_000,
  // The fallback used only when a fresh gas estimate cannot be obtained — see
  // resolveGasLimit. Zero's collateral-surplus claim previously configured no
  // gasLimit at all, so it never received the 30% margin the estimator
  // applies to a live read; this floor closes that gap. Set to the
  // delay-armed claimCollateral() call's measured cost (386,192 gasUsed,
  // fork rskForkedMainnetQa, delay 120s, charge on, 2026-09-19) plus the
  // same 30% margin, rounded up.
  CLAIM_SURPLUS: 600_000,
  APPROVE: 60_000,
  STAKING_STAKE: 1_400_000,
  STAKING_INCREASE_STAKE: 450_000,
  STAKING_EXTEND: 450_000,
  STAKING_WITHDRAW: 1_400_000,
  VESTING_DELEGATE: 4_650_000,
  SOV_WITHDRAW_VESTING: 6_000_000,
  SOV_WITHDRAW_VESTING_TEAM: 6_700_000,
  BORROW: 1_500_000,
  REPAY_LOAN: 950_000,
  // The fallback used only when a fresh gas estimate cannot be obtained —
  // see resolveGasLimit. Set to the withdrawal delay's own cost through
  // ExitDelayQueue plus the same 30% margin the estimator applies to a
  // live read (measured 448,331 gasUsed, fork rskForkedMainnetQa, delay
  // 120s, charge on, 2026-09-19), so a failed estimate still covers the
  // delay-armed case, not only the plain one the old 150,000 was sized for.
  WITHDRAW_LOAN_COLLATERAL: 600_000,
  GOVERNOR_PROPOSE: 1_500_000,
  PROPOSAL_VOTE: 300_000,
  PROPOSAL_QUEUE: 250_000,
  PROPOSAL_EXECUTE: 6_000_000,
  MARKET_MAKING_DEPOSIT: 6_000_000,
  MARKET_MAKING_ADD_LIQUIDITY: 750_000,
  MARKET_MAKING_REMOVE_LIQUIDITY: 650_000,
  MARKET_MAKING_CLAIM_FEES: 650_000,
  MARKET_MAKING_REPOSITION: 600_000,
  CLAIM_VESTED_SOV_REWARDS: 6_000_000,
  WITHDRAW_MARKET_MAKING_LIQUIDITY: 6_000_000,
};
