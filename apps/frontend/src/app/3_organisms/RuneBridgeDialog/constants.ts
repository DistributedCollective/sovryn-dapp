import { toWei } from '../../../utils/math';

export const ACTIVE_CLASSNAME = 'border-t-primary-30';

export const DEPOSIT_FEE_SATS = 0;
export const DEPOSIT_FEE_RUNE_PERCENTAGE = 0.4;

export const MIN_POSTAGE_SATS = 10_000;

export const MIN_POSTAGE_BTC = MIN_POSTAGE_SATS / 1e8;

export const WITHDRAW_MIN_AMOUNT = 1;
export const WITHDRAW_MAX_AMOUNT = 100_000;
export const WITHDRAW_FEE_BASE_CURRENCY_SATS = 30_000;
export const WITHDRAW_FEE_BASE_CURRENCY_BTC =
  WITHDRAW_FEE_BASE_CURRENCY_SATS / 1e8;
export const WITHDRAW_FEE_BASE_CURRENCY_WEI = toWei(
  WITHDRAW_FEE_BASE_CURRENCY_BTC,
);

export const WITHDRAW_FEE_RUNE_PERCENTAGE = 0.4;

export const GAS_LIMIT_RUNE_BRIDGE_WITHDRAW = 200000;
