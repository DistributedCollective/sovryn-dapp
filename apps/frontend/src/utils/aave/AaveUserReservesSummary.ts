import { ReserveDataHumanized } from '@aave/contract-helpers';
import {
  FormatReserveUSDResponse,
  FormatUserSummaryResponse,
} from '@aave/math-utils';

import { Decimal } from '@sovryn/utils';

type UserSummary = FormatUserSummaryResponse<
  ReserveDataHumanized & FormatReserveUSDResponse
>;

export enum ApyType {
  VARIABLE = 'variable',
  STABLE = 'stable',
}

export type SuppliedAsset = {
  asset: string;
  assetAddress: string;
  apy: Decimal;
  isCollateral: boolean;
  supplied: Decimal;
  suppliedUSD: Decimal;
};

export type BorrowedAsset = {
  asset: string;
  assetAddress: string;
  apy: Decimal;
  apyType: ApyType;
  borrowed: Decimal;
  borrowedUSD: Decimal;
};

export class AaveUserReservesSummary {
  public netWorth: Decimal;
  public netApy: Decimal;
  public healthFactor: Decimal;
  public supplyBalance: Decimal;
  public supplyWeightedApy: Decimal;
  public collateralBalance: Decimal;
  public borrowBalance: Decimal;
  public borrowWeightedApy: Decimal;
  public borrowPower: Decimal;
  public borrowPowerUsed: Decimal;
  public suppliedAssets: SuppliedAsset[];
  public borrowedAssets: BorrowedAsset[];
  public eModeEnabled: boolean;

  constructor(private readonly userSummary: UserSummary) {
    // balances
    this.netWorth = Decimal.from(this.userSummary.netWorthUSD);
    this.borrowBalance = Decimal.from(this.userSummary.totalBorrowsUSD);
    this.supplyBalance = this.computeSuppliedBalance(
      this.userSummary.userReservesData,
    );
    this.collateralBalance = this.computeCollateral(
      this.userSummary.userReservesData,
    );

    // apy
    this.supplyWeightedApy = this.computeWeightedSupplyApy(
      this.userSummary.userReservesData,
    );
    this.borrowWeightedApy = this.computeWeightedBorrowApy(
      this.userSummary.userReservesData,
    );
    this.netApy = this.computeNetApy(
      this.supplyWeightedApy,
      this.supplyBalance,
      this.borrowWeightedApy,
      this.borrowBalance,
      this.netWorth,
    );

    // health and borrow status
    this.borrowPower = this.computeBorrowPower(
      Decimal.from(this.userSummary.availableBorrowsUSD),
      this.borrowBalance,
    );
    this.borrowPowerUsed = this.computeBorrowPowerUsed(
      this.borrowBalance,
      this.borrowPower,
    );
    this.healthFactor = this.computeHealthFactor(
      this.collateralBalance,
      Decimal.from(this.userSummary.currentLiquidationThreshold),
      this.borrowBalance,
    );

    // supplied and borrowed assets
    this.suppliedAssets = this.computeSuppliedAssets(
      this.userSummary.userReservesData,
    );
    this.borrowedAssets = this.computeBorrowedAssets(
      this.userSummary.userReservesData,
    );

    // emode
    this.eModeEnabled = this.userSummary.userEmodeCategoryId !== 0;
  }

  static from(
    userSummary: FormatUserSummaryResponse<
      ReserveDataHumanized & FormatReserveUSDResponse
    >,
  ) {
    return new AaveUserReservesSummary(userSummary);
  }

  private computeNetApy(
    weightedSupplyApy: Decimal,
    suppliedBalance: Decimal,
    weightedBorrowApy: Decimal,
    borrowedBalance: Decimal,
    netWorthUsd: Decimal,
  ): Decimal {
    return weightedSupplyApy
      .mul(suppliedBalance)
      .div(netWorthUsd)
      .sub(weightedBorrowApy.mul(borrowedBalance).div(netWorthUsd));
  }

  private computeSuppliedBalance(
    reserves: UserSummary['userReservesData'],
  ): Decimal {
    return reserves.reduce(
      (suppliedBalance, r) => suppliedBalance.add(r.underlyingBalanceUSD),
      Decimal.from(0),
    );
  }

  private computeBorrowPower(
    availableBorrowsUSD: Decimal,
    borrowedBalance: Decimal,
  ) {
    return Decimal.from(availableBorrowsUSD).add(borrowedBalance);
  }

  private computeBorrowPowerUsed(
    borrowedBalance: Decimal,
    borrowPower: Decimal,
  ) {
    return Decimal.from(borrowedBalance).div(borrowPower).mul(100);
  }

  private computeCollateral(
    reserves: UserSummary['userReservesData'],
  ): Decimal {
    return reserves.reduce(
      (collateral, r) =>
        collateral.add(
          r.usageAsCollateralEnabledOnUser ? r.underlyingBalanceUSD : 0,
        ),
      Decimal.from(0),
    );
  }

  private computeHealthFactor(
    collateral: Decimal,
    currentLiquidationThreshold: Decimal,
    borrowedBalance: Decimal,
  ): Decimal {
    return collateral.mul(currentLiquidationThreshold).div(borrowedBalance);
  }

  private computeWeightedBorrowApy(
    reserves: UserSummary['userReservesData'],
  ): Decimal {
    let totalBorrowedUSD = Decimal.from(0);
    let weightedBorrowAPYSum = Decimal.from(0);

    reserves.forEach(reserve => {
      const borrowedAmountUSD = Decimal.from(reserve.totalBorrowsUSD);
      const borrowAPY = Decimal.from(reserve.reserve.variableBorrowAPY);

      weightedBorrowAPYSum = weightedBorrowAPYSum.add(
        borrowAPY.mul(borrowedAmountUSD),
      );
      totalBorrowedUSD = totalBorrowedUSD.add(borrowedAmountUSD);
    });

    return weightedBorrowAPYSum.div(totalBorrowedUSD).mul(100);
  }

  private computeWeightedSupplyApy(
    reserves: UserSummary['userReservesData'],
  ): Decimal {
    let totalBorrowedUSD = Decimal.from(0);
    let weightedBorrowAPYSum = Decimal.from(0);

    reserves.forEach(reserve => {
      const borrowedAmountUSD = Decimal.from(reserve.totalBorrowsUSD);
      const borrowAPY = Decimal.from(reserve.reserve.supplyAPY);

      weightedBorrowAPYSum = weightedBorrowAPYSum.add(
        borrowAPY.mul(borrowedAmountUSD),
      );
      totalBorrowedUSD = totalBorrowedUSD.add(borrowedAmountUSD);
    });

    return weightedBorrowAPYSum.div(totalBorrowedUSD).mul(100);
  }

  private computeSuppliedAssets(
    reserves: UserSummary['userReservesData'],
  ): SuppliedAsset[] {
    return reserves
      .filter(r => Decimal.from(r.underlyingBalanceUSD).gt(0))
      .map(r => ({
        asset: r.reserve.symbol,
        assetAddress: r.underlyingAsset,
        apy: Decimal.from(r.reserve.supplyAPY).mul(100),
        isCollateral: r.usageAsCollateralEnabledOnUser,
        supplied: Decimal.from(r.underlyingBalance),
        suppliedUSD: Decimal.from(r.underlyingBalanceUSD),
      }));
  }

  private computeBorrowedAssets(
    reserves: UserSummary['userReservesData'],
  ): BorrowedAsset[] {
    return reserves
      .filter(r => Decimal.from(r.totalBorrowsUSD).gt(0))
      .map(r => ({
        asset: r.reserve.symbol,
        assetAddress: r.underlyingAsset,
        borrowed: Decimal.from(r.totalBorrows),
        borrowedUSD: Decimal.from(r.totalBorrowsUSD),
        apy: Decimal.from(r.reserve.variableBorrowAPY).mul(100),
        apyType:
          Number(r.variableBorrows) > 0 ? ApyType.VARIABLE : ApyType.STABLE,
      }));
  }
}
