import React from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import { LendingPoolDictionary } from '../../../../../utils/LendingPoolDictionary';
import { decimalic } from '../../../../../utils/math';
import { LoanItem } from './OpenLoansTable.types';

export const normalizeSuffix = (asset: string) =>
  asset === 'WRBTC' ? BITCOIN : asset;

export const getAmountPrecision = (asset: string) =>
  ['WRBTC', BITCOIN].includes(asset)
    ? BTC_RENDER_PRECISION
    : TOKEN_RENDER_PRECISION;

export const normalizeTokenSuffix = (asset: SupportedTokens) =>
  [SupportedTokens.wrbtc, SupportedTokens.rbtc].includes(asset)
    ? BITCOIN
    : asset;

export const getTokenAmountPrecision = (asset: SupportedTokens) =>
  [SupportedTokens.wrbtc, SupportedTokens.rbtc].includes(asset)
    ? BTC_RENDER_PRECISION
    : TOKEN_RENDER_PRECISION;

export const calculateLiquidationPrice = (
  borrowedAmount: string,
  collateral: string,
) => {
  const maintenanceRatio = 115; // TODO: Hardcoded here because maintenance margin is hardcoded to 0.15 but it should be read from smart contracts

  return decimalic(borrowedAmount)
    .mul(decimalic(maintenanceRatio).div(100))
    .div(collateral)
    .toNumber();
};

export const generateRowTitle = (item: LoanItem) => (
  <AmountRenderer
    value={item.debt}
    suffix={normalizeTokenSuffix(item.debtAsset)}
    precision={getAmountPrecision(item.debtAsset)}
  />
);

export const convertLoanTokenToSupportedAssets = (loanToken: string) => {
  if (loanToken.toLowerCase() === 'wrbtc') {
    return SupportedTokens.rbtc;
  }

  if (
    loanToken.toLowerCase() === 'bitpro' ||
    loanToken.toLowerCase() === 'bitp'
  ) {
    return SupportedTokens.bpro;
  }

  return loanToken.toLowerCase() as SupportedTokens;
};

export const isSupportedPool = (
  loanToken: string | null | undefined,
  collateralToken: string | null | undefined,
) => {
  if (!loanToken || !collateralToken) {
    return false;
  }

  const pools = LendingPoolDictionary.assetList();
  const normalizedLoanToken = convertLoanTokenToSupportedAssets(loanToken);

  if (!pools.includes(normalizedLoanToken)) {
    return false;
  }

  const acceptedPoolCollateral = LendingPoolDictionary.pools
    .get(normalizedLoanToken)
    ?.getBorrowCollateral();

  return acceptedPoolCollateral?.includes(
    convertLoanTokenToSupportedAssets(collateralToken),
  );
};

export const calculateApr = (
  interestPerDay: Decimal,
  collateralAmount: Decimal,
) => interestPerDay.mul(365).div(collateralAmount).mul(100).toString();
