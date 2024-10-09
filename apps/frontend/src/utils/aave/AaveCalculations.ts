import { utils } from 'ethers';

import { Decimal } from '@sovryn/utils';

import { UserSummary } from './AaveUserReservesSummary';

export class AaveCalculations {
  static computeNetApy(
    weightedSupplyApy: Decimal,
    suppliedBalance: Decimal,
    weightedBorrowApy: Decimal,
    borrowedBalance: Decimal,
    netWorthUsd: Decimal,
  ): Decimal {
    if (netWorthUsd.eq(0)) {
      return Decimal.from(0);
    }

    return weightedSupplyApy
      .mul(suppliedBalance)
      .div(netWorthUsd)
      .sub(weightedBorrowApy.mul(borrowedBalance).div(netWorthUsd));
  }

  static computeSuppliedBalance(
    reserves: UserSummary['userReservesData'],
  ): Decimal {
    return reserves.reduce(
      (suppliedBalance, r) => suppliedBalance.add(r.underlyingBalanceUSD),
      Decimal.from(0),
    );
  }

  static computeBorrowPower(
    minCollateralRatio: Decimal,
    collateralBalance: Decimal,
  ) {
    return Decimal.from(collateralBalance).div(minCollateralRatio);
  }

  static computeBorrowPowerUsed(
    borrowedBalance: Decimal,
    borrowPower: Decimal,
  ) {
    if (borrowPower.eq(0)) {
      return Decimal.from(100); // all used
    }
    return Decimal.from(borrowedBalance).div(borrowPower).mul(100);
  }

  static computeCollateral(reserves: UserSummary['userReservesData']): Decimal {
    return reserves.reduce(
      (collateral, r) =>
        collateral.add(
          r.usageAsCollateralEnabledOnUser ? r.underlyingBalanceUSD : 0,
        ),
      Decimal.from(0),
    );
  }

  static computeHealthFactor(
    collateral: Decimal,
    currentLiquidationThreshold: Decimal,
    borrowedBalance: Decimal,
  ): Decimal {
    if (borrowedBalance.eq(0)) {
      return Decimal.from(Infinity);
    }
    return collateral.mul(currentLiquidationThreshold).div(borrowedBalance);
  }

  static computeCollateralRatio(collateral: Decimal, borrowedBalance: Decimal) {
    if (borrowedBalance.eq(0)) {
      return Decimal.from(Infinity);
    }
    return collateral.div(borrowedBalance);
  }

  static computeWeightedBorrowApy(
    reserves: UserSummary['userReservesData'],
  ): Decimal {
    let totalBorrowedUsd = Decimal.from(0);
    let weightedBorrowAPYSum = Decimal.from(0);

    reserves.forEach(reserve => {
      const borrowedAmountUsd = Decimal.from(reserve.totalBorrowsUSD);
      const borrowAPY = Decimal.from(reserve.reserve.variableBorrowAPY);

      weightedBorrowAPYSum = weightedBorrowAPYSum.add(
        borrowAPY.mul(borrowedAmountUsd),
      );
      totalBorrowedUsd = totalBorrowedUsd.add(borrowedAmountUsd);
    });

    if (totalBorrowedUsd.eq(0) || weightedBorrowAPYSum.eq(0)) {
      return Decimal.from(0);
    }
    return weightedBorrowAPYSum.div(totalBorrowedUsd).mul(100);
  }

  static computeWeightedSupplyApy(
    reserves: UserSummary['userReservesData'],
  ): Decimal {
    let totalSuppliedUsd = Decimal.from(0);
    let weightedSupplyAPYSum = Decimal.from(0);

    reserves.forEach(reserve => {
      const suppliedAmountUsd = Decimal.from(reserve.underlyingBalanceUSD);
      const supplyAPY = Decimal.from(reserve.reserve.supplyAPY);

      weightedSupplyAPYSum = weightedSupplyAPYSum.add(
        supplyAPY.mul(suppliedAmountUsd),
      );
      totalSuppliedUsd = totalSuppliedUsd.add(suppliedAmountUsd);
    });

    if (totalSuppliedUsd.eq(0) || weightedSupplyAPYSum.eq(0)) {
      return Decimal.from(0);
    }
    return weightedSupplyAPYSum.div(totalSuppliedUsd).mul(100);
  }

  static computeLiquidationPrice(
    borrowSize: Decimal,
    currentLiquidationThreshold: Decimal,
    collateralBalance: Decimal,
  ) {
    if (collateralBalance.eq(0)) {
      return Decimal.from(Infinity); // get liquidated right away
    }
    return borrowSize.mul(currentLiquidationThreshold).div(collateralBalance);
  }

  static calculateUtilizationRate = (
    decimals: number,
    totalDebt: string,
    availableLiquidity: string,
  ): Decimal => {
    const totalBorrowBigInt = BigInt(
      utils.parseUnits(totalDebt, decimals).toString(),
    );
    const availableLiquidityBigInt = BigInt(availableLiquidity);

    const totalSupplyBigInt = totalBorrowBigInt + availableLiquidityBigInt;

    if (totalSupplyBigInt === BigInt(0)) {
      return Decimal.from(0);
    }

    const utilizationRateBigInt =
      (totalBorrowBigInt * BigInt(10 ** decimals)) / totalSupplyBigInt;

    const utilizationRate = utils.formatUnits(
      utilizationRateBigInt.toString(),
      decimals,
    );

    const utilizationRateDecimal = Decimal.from(utilizationRate);

    const isBetweenZeroAndOne =
      utilizationRateDecimal.gte(Decimal.from(0)) &&
      utilizationRateDecimal.lte(Decimal.from(1));

    if (!isBetweenZeroAndOne) {
      return Decimal.from(0);
    }

    return utilizationRateDecimal;
  };
}
