import {
  ReserveDataHumanized,
  ReservesDataHumanized,
} from '@aave/contract-helpers';
import {
  formatReserves,
  FormatReserveUSDResponse,
  formatUserSummary,
  FormatUserSummaryResponse,
} from '@aave/math-utils';

import { BigNumber, ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

import { AssetDetailsData, getAssetData } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../config/chains';

import { config } from '../../constants/aave';
import { Reserve } from '../../hooks/aave/useAaveReservesData';
import { BorrowRateMode, UserReservesData } from '../../types/aave';
import { decimalic, fromWei } from '../math';
import { AaveCalculations } from './AaveCalculations';

export type UserSummary = FormatUserSummaryResponse<
  ReserveDataHumanized & FormatReserveUSDResponse
>;

export type ReserveSummary = {
  reserve: Reserve;
  asset: string;

  walletBalance: Decimal;
  walletBalanceUsd: Decimal;
  collateral: boolean;
  supplied: Decimal;
  suppliedUSD: Decimal;
  borrowed: Decimal;
  borrowedUSD: Decimal;
  borrowRateMode: BorrowRateMode;
  availableToBorrow: Decimal;
  availableToBorrowUSD: Decimal;
};

export type AaveUserReservesSummary = {
  netApy: Decimal;
  netWorth: Decimal;
  healthFactor: Decimal;
  collateralRatio: Decimal;

  supplyBalance: Decimal;
  supplyWeightedApy: Decimal;
  collateralBalance: Decimal;
  currentLiquidationThreshold: Decimal;
  currentLoanToValue: Decimal;

  borrowBalance: Decimal;
  borrowWeightedApy: Decimal;
  borrowPower: Decimal;
  borrowPowerUsed: Decimal;
  eModeEnabled: boolean;
  eModeCategoryId: number;
  reserves: ReserveSummary[];
};

export class AaveUserReservesSummaryFactory {
  static buildZeroSummary(reserves: Reserve[]): AaveUserReservesSummary {
    return {
      netApy: Decimal.ZERO,
      netWorth: Decimal.ZERO,
      healthFactor: Decimal.ZERO,
      collateralRatio: Decimal.ZERO,

      supplyBalance: Decimal.ZERO,
      supplyWeightedApy: Decimal.ZERO,
      collateralBalance: Decimal.ZERO,
      currentLiquidationThreshold: Decimal.ZERO,
      currentLoanToValue: Decimal.ZERO,

      borrowBalance: Decimal.ZERO,
      borrowWeightedApy: Decimal.ZERO,
      borrowPower: Decimal.ZERO,
      borrowPowerUsed: Decimal.ZERO,
      eModeEnabled: false,
      eModeCategoryId: 0,

      reserves: reserves.map(r => ({
        reserve: r,
        asset: r.symbol,

        walletBalance: Decimal.ZERO,
        walletBalanceUsd: Decimal.ZERO,
        collateral: false,
        supplied: Decimal.ZERO,
        suppliedUSD: Decimal.ZERO,
        availableToSupply: Decimal.ZERO,
        borrowed: Decimal.ZERO,
        borrowedUSD: Decimal.ZERO,
        borrowRateMode: BorrowRateMode.VARIABLE,
        availableToBorrow: Decimal.ZERO,
        availableToBorrowUSD: Decimal.ZERO,
      })),
    };
  }

  static async buildSummary({
    provider,
    account,
    reservesData,
    userReservesData,
    currentTimestamp,
  }: {
    provider: ethers.providers.Provider;
    account: string;
    reservesData: ReservesDataHumanized;
    userReservesData: UserReservesData;
    currentTimestamp: number;
  }): Promise<AaveUserReservesSummary> {
    const {
      marketReferenceCurrencyDecimals,
      marketReferenceCurrencyPriceInUsd: marketReferencePriceInUsd,
    } = reservesData.baseCurrencyData;
    const userSummary = formatUserSummary({
      currentTimestamp,
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
      userReserves: userReservesData.userReserves,
      userEmodeCategoryId: userReservesData.userEmodeCategoryId,
      formattedReserves: formatReserves({
        currentTimestamp,
        marketReferencePriceInUsd,
        marketReferenceCurrencyDecimals,
        reserves: reservesData.reservesData,
      }),
    });

    const netWorth = Decimal.from(userSummary.netWorthUSD);
    const borrowBalance = Decimal.from(userSummary.totalBorrowsUSD);
    const supplyBalance = AaveCalculations.computeSuppliedBalance(
      userSummary.userReservesData,
    );
    const collateralBalance = AaveCalculations.computeCollateral(
      userSummary.userReservesData,
    );
    const supplyWeightedApy = AaveCalculations.computeWeightedSupplyApy(
      userSummary.userReservesData,
    );
    const borrowWeightedApy = AaveCalculations.computeWeightedBorrowApy(
      userSummary.userReservesData,
    );
    const netApy = AaveCalculations.computeNetApy(
      supplyWeightedApy,
      supplyBalance,
      borrowWeightedApy,
      borrowBalance,
      netWorth,
    );

    // health and borrow status
    const currentLiquidationThreshold = Decimal.from(
      userSummary.currentLiquidationThreshold,
    );
    const borrowPower = AaveCalculations.computeBorrowPower(
      config.MinCollateralRatio,
      collateralBalance,
    );
    const borrowPowerUsed = AaveCalculations.computeBorrowPowerUsed(
      borrowBalance,
      borrowPower,
    );
    const healthFactor = AaveCalculations.computeHealthFactor(
      collateralBalance,
      currentLiquidationThreshold,
      borrowBalance,
    );
    const collateralRatio = AaveCalculations.computeCollateralRatio(
      collateralBalance,
      borrowBalance,
    );

    return {
      netApy,
      netWorth,
      healthFactor,
      collateralRatio,

      supplyBalance,
      supplyWeightedApy,
      collateralBalance,
      currentLiquidationThreshold,
      currentLoanToValue: Decimal.from(userSummary.currentLoanToValue),

      borrowBalance,
      borrowWeightedApy,
      borrowPower,
      borrowPowerUsed,
      eModeEnabled: userSummary.userEmodeCategoryId !== 0,
      eModeCategoryId: userSummary.userEmodeCategoryId,

      reserves: await Promise.all(
        userSummary.userReservesData.map(async r => {
          const symbol = r.reserve.symbol === 'WETH' ? 'ETH' : r.reserve.symbol;
          const asset = await getAssetData(symbol, BOB_CHAIN_ID);
          const balance = await getBalance(asset, account, provider);
          const decimalBalance = decimalic(fromWei(balance, asset.decimals));
          const availableLiquidity = Decimal.from(
            formatUnits(r.reserve.availableLiquidity, r.reserve.decimals),
          );

          // how much the user can borrow if there's no limit of supply
          const canBorrow = borrowPower
            .sub(borrowBalance)
            .div(r.reserve.priceInUSD);

          // available to borrow for user including liquidity limitation
          const availableToBorrow = availableLiquidity.lt(canBorrow)
            ? availableLiquidity
            : canBorrow;
          const availableToBorrowUSD = availableToBorrow.mul(
            r.reserve.priceInUSD,
          );

          return {
            asset: symbol,
            reserve: { ...r.reserve, symbol },

            walletBalance: decimalBalance,
            walletBalanceUsd: decimalBalance.mul(r.reserve.priceInUSD),
            collateral: r.usageAsCollateralEnabledOnUser,

            supplied: Decimal.from(r.underlyingBalance),
            suppliedUSD: Decimal.from(r.underlyingBalanceUSD),
            borrowed: Decimal.from(r.totalBorrows),
            borrowedUSD: Decimal.from(r.totalBorrowsUSD),
            availableToBorrow,
            availableToBorrowUSD,

            borrowRateMode: Decimal.from(r.variableBorrows).gt(0)
              ? BorrowRateMode.VARIABLE
              : BorrowRateMode.STABLE,
          } as ReserveSummary;
        }),
      ),
    };
  }
}

function getBalance(
  asset: AssetDetailsData,
  account: string,
  provider: ethers.providers.Provider,
): Promise<BigNumber> {
  return asset.isNative
    ? provider.getBalance(account)
    : asset.contract(provider).balanceOf(account);
}
