/* eslint-disable prefer-const */
import { AddressZero } from '@ethersproject/constants';

import { BigNumber, BigNumberish, Contract } from 'ethers';

import { CrocContext } from './context';
import {
  CrocSurplusFlags,
  decodeSurplusFlag,
  encodeSurplusArg,
} from './encoding/flags';
import { PoolInitEncoder } from './encoding/init';
import { WarmPathEncoder } from './encoding/liquidity';
import {
  CrocEthView,
  CrocTokenView,
  sortBaseQuoteViews,
  TokenQty,
} from './tokens';
import {
  decodeCrocPrice,
  toDisplayPrice,
  bigNumToFloat,
  toDisplayQty,
  fromDisplayPrice,
  roundForConcLiq,
  concDepositSkew,
  pinTickLower,
  pinTickUpper,
  neighborTicks,
  pinTickOutside,
  tickToPrice,
  concBaseSlippagePrice,
  concQuoteSlippagePrice,
} from './utils';

type PriceRange = [number, number];
type TickRange = [number, number];
type BlockTag = number | string;

type Params = {
  contract: Contract;
  path: number;
  calldata: string;
  txArgs?: { value?: BigNumberish; gasLimit?: BigNumberish };
};

export class CrocPoolView {
  constructor(
    quoteToken: CrocTokenView,
    baseToken: CrocTokenView,
    poolIndex: number,
    context: Promise<CrocContext>,
  ) {
    [this.baseToken, this.quoteToken] = sortBaseQuoteViews(
      baseToken,
      quoteToken,
    );
    this.context = context;

    this.baseDecimals = this.baseToken.decimals;
    this.quoteDecimals = this.quoteToken.decimals;

    this.useTrueBase = this.baseToken.tokenAddr === baseToken.tokenAddr;
    this.poolIndex = poolIndex;
  }

  /* Checks to see if a canonical pool has been initialized for this pair. */
  async isInit(): Promise<boolean> {
    return this.spotPrice().then(p => p > 0);
  }

  async spotPrice(block?: BlockTag): Promise<number> {
    let txArgs = block ? { blockTag: block } : {};
    let sqrtPrice = (await this.context).query.queryPrice(
      this.baseToken.tokenAddr,
      this.quoteToken.tokenAddr,
      this.poolIndex,
      txArgs,
    );
    return decodeCrocPrice(await sqrtPrice);
  }

  async displayPrice(block?: BlockTag): Promise<number> {
    let spotPrice = this.spotPrice(block);
    return this.toDisplayPrice(await spotPrice);
  }

  async spotTick(block?: BlockTag): Promise<number> {
    let txArgs = block ? { blockTag: block } : {};
    return (await this.context).query.queryCurveTick(
      this.baseToken.tokenAddr,
      this.quoteToken.tokenAddr,
      this.poolIndex,
      txArgs,
    );
  }

  async xykLiquidity(block?: BlockTag): Promise<TokenQty> {
    let txArgs = block ? { blockTag: block } : {};
    return (await this.context).query.queryLiquidity(
      this.baseToken.tokenAddr,
      this.quoteToken.tokenAddr,
      this.poolIndex,
      txArgs,
    );
  }

  async curveState(block?: BlockTag) {
    let txArgs = block ? { blockTag: block } : {};
    return (await this.context).query.queryCurve(
      this.baseToken.tokenAddr,
      this.quoteToken.tokenAddr,
      this.poolIndex,
      txArgs,
    );
  }

  async cumAmbientGrowth(block?: BlockTag): Promise<number> {
    let txArgs = block ? { blockTag: block } : {};
    const queryCurve = (await this.context).query.queryCurve(
      this.baseToken.tokenAddr,
      this.quoteToken.tokenAddr,
      this.poolIndex,
      txArgs,
    );
    const seedDeflator = (await queryCurve).seedDeflator_;
    return seedDeflator / Math.pow(2, 48);
  }

  async toDisplayPrice(spotPrice: number): Promise<number> {
    return toDisplayPrice(
      spotPrice,
      await this.baseDecimals,
      await this.quoteDecimals,
      !this.useTrueBase,
    );
  }

  async fromDisplayPrice(dispPrice: number): Promise<number> {
    return fromDisplayPrice(
      dispPrice,
      await this.baseDecimals,
      await this.quoteDecimals,
      !this.useTrueBase,
    );
  }

  async displayToPinTick(dispPrice: number): Promise<[number, number]> {
    const spotPrice = await this.fromDisplayPrice(dispPrice);
    const gridSize = (await this.context).chain.gridSize;
    return [
      pinTickLower(spotPrice, gridSize),
      pinTickUpper(spotPrice, gridSize),
    ];
  }

  async displayToNeighborTicks(
    dispPrice: number,
    nNeighbors: number = 3,
  ): Promise<{ below: number[]; above: number[] }> {
    const spotPrice = await this.fromDisplayPrice(dispPrice);
    const gridSize = (await this.context).chain.gridSize;
    return neighborTicks(spotPrice, gridSize, nNeighbors);
  }

  async displayToNeighborTickPrices(
    dispPrice: number,
    nNeighbors: number = 3,
  ): Promise<{ below: number[]; above: number[] }> {
    const ticks = await this.displayToNeighborTicks(dispPrice, nNeighbors);
    const toPriceFn = (tick: number) => this.toDisplayPrice(tickToPrice(tick));

    const belowPrices = Promise.all(ticks.below.map(toPriceFn));
    const abovePrices = Promise.all(ticks.above.map(toPriceFn));

    return this.useTrueBase
      ? { below: await belowPrices, above: await abovePrices }
      : { below: await abovePrices, above: await belowPrices };
  }

  async displayToOutsidePin(dispPrice: number): Promise<{
    tick: number;
    price: number;
    isTickBelow: boolean;
    isPriceBelow: boolean;
  }> {
    const spotPrice = this.fromDisplayPrice(dispPrice);
    const gridSize = (await this.context).chain.gridSize;

    const pinTick = pinTickOutside(
      await spotPrice,
      await this.spotPrice(),
      gridSize,
    );
    const pinPrice = this.toDisplayPrice(tickToPrice(pinTick.tick));

    return Object.assign(pinTick, {
      price: await pinPrice,
      isPriceBelow: (await pinPrice) < dispPrice,
    });
  }

  async initPool(initPrice: number) {
    // Very small amount of ETH in economic terms but more than sufficient for min init burn
    const ETH_INIT_BURN = BigNumber.from(10).pow(12);
    let txArgs =
      this.baseToken.tokenAddr === AddressZero ? { value: ETH_INIT_BURN } : {};

    let encoder = new PoolInitEncoder(
      this.baseToken.tokenAddr,
      this.quoteToken.tokenAddr,
      this.poolIndex,
    );

    let spotPrice = this.fromDisplayPrice(initPrice);
    let calldata = encoder.encodeInitialize(await spotPrice);

    let cntx = await this.context;

    return {
      contract: cntx.dex,
      fn: 'userCmd',
      args: [cntx.chain.proxyPaths.cold, calldata],
      ...txArgs,
    };
  }

  async mintAmbientBase(
    qty: TokenQty,
    limits: PriceRange,
    opts?: CrocLpOpts,
  ): Promise<Params> {
    return this.mintAmbient(qty, this.useTrueBase, limits, opts);
  }

  async mintAmbientQuote(
    qty: TokenQty,
    limits: PriceRange,
    opts?: CrocLpOpts,
  ): Promise<Params> {
    return this.mintAmbient(qty, !this.useTrueBase, limits, opts);
  }

  async mintRangeBase(
    qty: TokenQty,
    range: TickRange,
    limits: PriceRange,
    opts?: CrocLpOpts,
  ): Promise<Params> {
    return this.mintRange(qty, this.useTrueBase, range, await limits, opts);
  }

  async mintRangeQuote(
    qty: TokenQty,
    range: TickRange,
    limits: PriceRange,
    opts?: CrocLpOpts,
  ): Promise<Params> {
    return this.mintRange(qty, !this.useTrueBase, range, await limits, opts);
  }

  async burnAmbientLiq(
    liq: BigNumber,
    limits: PriceRange,
    opts?: CrocLpOpts,
  ): Promise<string> {
    let [lowerBound, upperBound] = await this.transformLimits(limits);
    const calldata = (await this.makeEncoder()).encodeBurnAmbient(
      liq,
      lowerBound,
      upperBound,
      this.maskSurplusFlag(opts),
      this.applyLpConduit(opts),
    );
    return calldata;
  }

  async burnAmbientAll(limits: PriceRange, opts?: CrocLpOpts): Promise<string> {
    let [lowerBound, upperBound] = await this.transformLimits(limits);
    const calldata = (await this.makeEncoder()).encodeBurnAmbientAll(
      lowerBound,
      upperBound,
      this.maskSurplusFlag(opts),
      this.applyLpConduit(opts),
    );
    return calldata;
  }

  async burnRangeLiq(
    liq: BigNumber,
    range: TickRange,
    limits: PriceRange,
    opts?: CrocLpOpts,
  ): Promise<string> {
    let [lowerBound, upperBound] = await this.transformLimits(limits);
    let roundLotLiq = roundForConcLiq(liq);
    const calldata = (await this.makeEncoder()).encodeBurnConc(
      range[0],
      range[1],
      roundLotLiq,
      lowerBound,
      upperBound,
      this.maskSurplusFlag(opts),
      this.applyLpConduit(opts),
    );
    return calldata;
  }

  async harvestRange(
    range: TickRange,
    limits: PriceRange,
    opts?: CrocLpOpts,
  ): Promise<string> {
    let [lowerBound, upperBound] = await this.transformLimits(limits);
    const calldata = (await this.makeEncoder()).encodeHarvestConc(
      range[0],
      range[1],
      lowerBound,
      upperBound,
      this.maskSurplusFlag(opts),
      this.applyLpConduit(opts),
    );
    return calldata;
  }

  public async constructParams(
    calldata: string,
    txArgs?: { value?: BigNumberish },
  ): Promise<Params> {
    let cntx = await this.context;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (txArgs && !txArgs.gasLimit) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      txArgs.gasLimit = BigNumber.from(6_000_000);
    }

    return txArgs
      ? {
          contract: cntx.dex,
          path: cntx.chain.proxyPaths.liq,
          calldata,
          txArgs,
        }
      : {
          contract: cntx.dex,
          path: cntx.chain.proxyPaths.liq,
          calldata,
        };
  }

  private async mintAmbient(
    qty: TokenQty,
    isQtyBase: boolean,
    limits: PriceRange,
    opts?: CrocLpOpts,
  ): Promise<Params> {
    let msgVal = this.msgValAmbient(qty, isQtyBase, limits, opts);
    let weiQty = this.normQty(qty, isQtyBase);

    let [lowerBound, upperBound] = await this.transformLimits(limits);

    const calldata = (await this.makeEncoder()).encodeMintAmbient(
      await weiQty,
      isQtyBase,
      lowerBound,
      upperBound,
      this.maskSurplusFlag(opts),
      this.applyLpConduit(opts),
    );

    return this.constructParams(calldata, { value: await msgVal });
  }

  private async boundLimits(
    range: TickRange,
    limits: PriceRange,
    isQtyBase: boolean,
    floatingSlippage: number = 0.1,
  ): Promise<PriceRange> {
    let spotPrice = this.spotPrice();
    const [lowerPrice, upperPrice] = this.rangeToPrice(range);
    const [boundLower, boundUpper] = await this.transformLimits(limits);
    const BOUND_PREC = 1.0001;

    let [amplifyLower, amplifyUpper] = [boundLower, boundUpper];

    if (upperPrice < (await spotPrice)) {
      amplifyLower = upperPrice * BOUND_PREC;
    } else if (lowerPrice > (await spotPrice)) {
      amplifyUpper = lowerPrice / BOUND_PREC;
    } else {
      if (isQtyBase) {
        amplifyLower = concBaseSlippagePrice(
          await spotPrice,
          upperPrice,
          floatingSlippage,
        );
      } else {
        amplifyUpper = concQuoteSlippagePrice(
          await spotPrice,
          lowerPrice,
          floatingSlippage,
        );
      }
    }

    return this.untransformLimits([
      Math.max(amplifyLower, boundLower),
      Math.min(amplifyUpper, boundUpper),
    ]);
  }

  private rangeToPrice(range: TickRange): PriceRange {
    const lowerPrice = Math.pow(1.0001, range[0]);
    const upperPrice = Math.pow(1.0001, range[1]);
    return [lowerPrice, upperPrice];
  }

  private async transformLimits(limits: PriceRange): Promise<PriceRange> {
    let left = this.fromDisplayPrice(limits[0]);
    let right = this.fromDisplayPrice(limits[1]);
    return (await left) < (await right)
      ? [await left, await right]
      : [await right, await left];
  }

  private async untransformLimits(limits: PriceRange): Promise<PriceRange> {
    let left = this.toDisplayPrice(limits[0]);
    let right = this.toDisplayPrice(limits[1]);
    return (await left) < (await right)
      ? [await left, await right]
      : [await right, await left];
  }

  private async mintRange(
    qty: TokenQty,
    isQtyBase: boolean,
    range: TickRange,
    limits: PriceRange,
    opts?: CrocLpOpts,
  ): Promise<Params> {
    const saneLimits = await this.boundLimits(
      range,
      limits,
      isQtyBase,
      opts?.floatingSlippage,
    );

    let msgVal = this.msgValRange(
      qty,
      isQtyBase,
      range,
      await saneLimits,
      opts,
    );

    let weiQty = this.normQty(qty, isQtyBase);
    let [lowerBound, upperBound] = await this.transformLimits(await saneLimits);

    const calldata = (await this.makeEncoder()).encodeMintConc(
      range[0],
      range[1],
      await weiQty,
      isQtyBase,
      lowerBound,
      upperBound,
      this.maskSurplusFlag(opts),
      this.applyLpConduit(opts),
    );
    return this.constructParams(calldata, { value: await msgVal });
  }

  private maskSurplusFlag(opts?: CrocLpOpts): number {
    if (!opts || opts.surplus === undefined) {
      return this.maskSurplusFlag({ surplus: false });
    }
    return encodeSurplusArg(opts.surplus, this.useTrueBase);
  }

  private applyLpConduit(opts?: CrocLpOpts): string {
    if (!opts || opts.lpConduit === undefined) {
      return AddressZero;
    }
    return opts.lpConduit;
  }

  private async msgValAmbient(
    qty: TokenQty,
    isQtyBase: boolean,
    limits: PriceRange,
    opts?: CrocLpOpts,
  ): Promise<BigNumber> {
    let ethQty = isQtyBase ? qty : this.ethForAmbientQuote(qty, limits);
    return this.ethToAttach(await ethQty, opts);
  }

  private async msgValRange(
    qty: TokenQty,
    isQtyBase: boolean,
    range: TickRange,
    limits: PriceRange,
    opts?: CrocLpOpts,
  ): Promise<BigNumber> {
    let ethQty = isQtyBase ? qty : this.ethForRangeQuote(qty, range, limits);
    return this.ethToAttach(await ethQty, opts);
  }

  private async ethToAttach(
    neededQty: TokenQty,
    opts?: CrocLpOpts,
  ): Promise<BigNumber> {
    if (this.baseToken.tokenAddr !== AddressZero) {
      return BigNumber.from(0);
    }

    const ethQty = await this.normEth(neededQty);
    let useSurplus = decodeSurplusFlag(this.maskSurplusFlag(opts))[0];

    if (useSurplus) {
      return new CrocEthView(this.context).msgValOverSurplus(ethQty);
    } else {
      return BigNumber.from(ethQty);
    }
  }

  private async ethForAmbientQuote(
    quoteQty: TokenQty,
    limits: PriceRange,
  ): Promise<TokenQty> {
    const weiEth = this.calcEthInQuote(quoteQty, limits);
    return toDisplayQty(await weiEth, await this.baseDecimals);
  }

  private async calcEthInQuote(
    quoteQty: TokenQty,
    limits: PriceRange,
    precAdj: number = 1.001,
  ): Promise<number> {
    const weiQty = await this.normQty(quoteQty, false);
    const [, boundPrice] = await this.transformLimits(limits);
    return Math.round(bigNumToFloat(weiQty) * boundPrice * precAdj);
  }

  private async ethForRangeQuote(
    quoteQty: TokenQty,
    range: TickRange,
    limits: PriceRange,
  ): Promise<TokenQty> {
    const spotPrice = await this.spotPrice();
    // const [, boundPrice] = await this.transformLimits(limits)
    const [lowerPrice, upperPrice] = this.rangeToPrice(range);

    let skew = concDepositSkew(spotPrice, lowerPrice, upperPrice);
    // let skew = concDepositSkew(boundPrice, lowerPrice, upperPrice);
    let ambiQty = this.calcEthInQuote(quoteQty, limits);
    let concQty = ambiQty.then(aq => Math.ceil(aq * skew));

    return toDisplayQty(await concQty, await this.baseDecimals);
  }

  private async normEth(ethQty: TokenQty): Promise<BigNumber> {
    return this.normQty(ethQty, true); // ETH is always on base side
  }

  private async normQty(qty: TokenQty, isBase: boolean): Promise<BigNumber> {
    let token = isBase ? this.baseToken : this.quoteToken;
    return token.normQty(qty);
  }

  private async makeEncoder(): Promise<WarmPathEncoder> {
    return new WarmPathEncoder(
      this.baseToken.tokenAddr,
      this.quoteToken.tokenAddr,
      this.poolIndex,
    );
  }

  readonly baseToken: CrocTokenView;
  readonly quoteToken: CrocTokenView;
  readonly baseDecimals: Promise<number>;
  readonly quoteDecimals: Promise<number>;
  readonly useTrueBase: boolean;
  readonly context: Promise<CrocContext>;
  readonly poolIndex: number;
}

export interface CrocLpOpts {
  surplus?: CrocSurplusFlags;
  floatingSlippage?: number;
  lpConduit?: string;
}
