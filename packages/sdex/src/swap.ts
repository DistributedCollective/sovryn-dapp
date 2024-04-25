import { AddressZero } from '@ethersproject/constants';
import { TransactionResponse } from '@ethersproject/providers';

import { BigNumber, Contract, ContractFunction, utils } from 'ethers';
import { AbiCoder } from 'ethers/lib/utils';

import { MAX_SQRT_PRICE, MIN_SQRT_PRICE } from './constants';
import { CrocContext } from './context';
import {
  CrocSurplusFlags,
  decodeSurplusFlag,
  encodeSurplusArg,
} from './encoding/flags';
import { CrocPoolView } from './pool';
import { CrocSlotReader } from './slots';
import {
  CrocEthView,
  CrocTokenView,
  sortBaseQuoteViews,
  TokenQty,
} from './tokens';
import {
  decodeCrocPrice,
  getUnsignedRawTransaction,
  GAS_PADDING,
} from './utils';

/* Describes the predicted impact of a given swap.
 * @property sellQty The total quantity of tokens predicted to be sold by the swapper to the dex.
 * @property buyQty The total quantity of tokens predicted to be bought by the swapper from the dex.
 * @property finalPrice The final price of the pool after the swap. *Note* this is not the same as the
 *                      realized swap price.
 * @property percentChange The percent change in the pool price after the swap. Note this is not the same
 *                         as the swapper's slippage against the pool.
 */
export interface CrocImpact {
  sellQty: string;
  buyQty: string;
  finalPrice: number;
  percentChange: number;
}

export interface CrocTransactionData {
  to: string;
  data: string;
  value: BigNumber;
}

/* Options for the */
export interface CrocSwapExecOpts {
  settlement?: boolean | { buyDexSurplus: boolean; sellDexSurplus: boolean };
  gasEst?: BigNumber;
  from?: string;
}

export interface CrocSwapPlanOpts {
  slippage?: number;
}

export class CrocSwapPlan {
  public readonly poolIndex: number;
  constructor(
    sellToken: CrocTokenView,
    buyToken: CrocTokenView,
    qty: TokenQty,
    qtyIsBuy: boolean,
    poolIndex: number,
    context: Promise<CrocContext>,
    opts: CrocSwapPlanOpts = DFLT_SWAP_ARGS,
  ) {
    this.poolIndex = poolIndex;

    [this.baseToken, this.quoteToken] = sortBaseQuoteViews(sellToken, buyToken);
    this.sellBase = this.baseToken === sellToken;
    this.qtyInBase = this.sellBase !== qtyIsBuy;

    this.poolView = new CrocPoolView(
      this.baseToken,
      this.quoteToken,
      this.poolIndex,
      context,
    );
    const tokenView = this.qtyInBase ? this.baseToken : this.quoteToken;
    this.qty = tokenView.normQty(qty);

    this.slippage = opts.slippage || DFLT_SWAP_ARGS.slippage;
    this.priceSlippage = this.slippage * PRICE_SLIP_MULT;
    this.context = context;

    this.impact = this.calcImpact();
    this.callType = '';
  }

  async generateTxData(
    args: CrocSwapExecOpts = {},
  ): Promise<CrocTransactionData> {
    return this.buildTxData(args);
  }

  async generateSwapData(
    args: CrocSwapExecOpts = {},
  ): Promise<CrocTransactionData> {
    return this.buildTxData(args);
  }

  async generateSwapArgs(
    args: CrocSwapExecOpts = {},
  ): Promise<CrocSwapExecOpts> {
    return args;
  }

  async swap(args: CrocSwapExecOpts = {}): Promise<TransactionResponse> {
    // const gasEst = await this.estimateGas(args);
    const gasEst = BigNumber.from(6_000_000);
    const callArgs = Object.assign({ gasEst: gasEst }, args);
    return this.sendTx(Object.assign({}, args, callArgs));
  }

  async swapArgs(
    args: CrocSwapExecOpts = {},
  ): Promise<CrocSwapExecOpts & { gasEst: BigNumber }> {
    const gasEst = await this.estimateGas(args);
    const callArgs = Object.assign({ gasEst: gasEst }, args);
    return Object.assign({}, args, callArgs);
  }

  async simulate(args: CrocSwapExecOpts = {}): Promise<TransactionResponse> {
    const gasEst = await this.estimateGas(args);
    const callArgs = Object.assign({ gasEst: gasEst }, args);

    return this.callStatic(Object.assign({}, args, callArgs));
  }

  private async buildTxData(
    args: CrocSwapExecOpts,
  ): Promise<CrocTransactionData> {
    const { to, data, value } = await this.hotPathBuildTxData(
      await this.txBase(),
      args,
    );

    return {
      to: to || '',
      data: data || '',
      value: value || BigNumber.from(0),
    };
  }

  private async hotPathBuildTxData<T>(
    base: { [name: string]: ContractFunction<T> },
    args: CrocSwapExecOpts,
  ): Promise<CrocTransactionData> {
    const reader = new CrocSlotReader(this.context);
    if (this.callType === 'proxy') {
      return this.userCmdBuildTxData(base as Contract, args);
    } else if (this.callType === 'router') {
      return this.swapBuildTxData(base as Contract, args);
    } else if (this.callType === 'bypass') {
      return this.swapBuildTxData(base as Contract, args);
    } else {
      return (await reader.isHotPathOpen())
        ? this.swapBuildTxData(base as Contract, args)
        : this.userCmdBuildTxData(base as Contract, args);
    }
  }

  private async userCmdBuildTxData(
    contract: Contract,
    args: CrocSwapExecOpts,
  ): Promise<CrocTransactionData> {
    const TIP = 0;
    const surplusFlags = this.maskSurplusArgs(args);

    const HOT_PROXY_IDX = 1;

    const abi = new utils.AbiCoder();
    const cmd = abi.encode(
      [
        'address',
        'address',
        'uint256',
        'bool',
        'bool',
        'uint128',
        'uint16',
        'uint128',
        'uint128',
        'uint8',
      ],
      [
        this.baseToken.tokenAddr,
        this.quoteToken.tokenAddr,
        this.poolIndex,
        this.sellBase,
        this.qtyInBase,
        await this.qty,
        TIP,
        await this.calcLimitPrice(),
        await this.calcSlipQty(),
        surplusFlags,
      ],
    );

    const { value } = await this.buildTxArgs(surplusFlags, args.gasEst);

    return {
      to: contract.address,
      data: contract.interface.encodeFunctionData('userCmd', [
        HOT_PROXY_IDX,
        cmd,
      ]),
      value,
    };
  }

  private async swapBuildTxData(
    contract: Contract,
    args: CrocSwapExecOpts,
  ): Promise<CrocTransactionData> {
    const TIP = 0;
    const surplusFlags = this.maskSurplusArgs(args);

    const data = contract.interface.encodeFunctionData('swap', [
      this.baseToken.tokenAddr,
      this.quoteToken.tokenAddr,
      this.poolIndex,
      this.sellBase,
      this.qtyInBase,
      await this.qty,
      TIP,
      await this.calcLimitPrice(),
      await this.calcSlipQty(),
      surplusFlags,
    ]);

    const { value } = await this.attachEthMsg(surplusFlags);

    return {
      to: contract.address,
      data,
      value,
    };
  }

  private async sendTx(args: CrocSwapExecOpts): Promise<TransactionResponse> {
    return this.hotPathCall(await this.txBase(), args);
  }

  private async callStatic(
    args: CrocSwapExecOpts,
  ): Promise<TransactionResponse> {
    const base = await this.txBase();
    return this.hotPathCall(base.callStatic, args);
  }

  async estimateGas(args: CrocSwapExecOpts = {}): Promise<BigNumber> {
    const base = await this.txBase();
    return this.hotPathCall(base.estimateGas, args);
  }

  async txBase() {
    if (this.callType === 'router') {
      const router = (await this.context).router;
      if (!router) {
        throw new Error('Router not available on network');
      }
      return router;
    } else if (
      this.callType === 'bypass' &&
      (await this.context).routerBypass
    ) {
      const router = (await this.context).routerBypass;
      if (!router) {
        throw new Error('Router not available on network');
      }
      return router || (await this.context).dex;
    } else {
      return (await this.context).dex;
    }
  }

  private async hotPathCall<T>(
    base: { [name: string]: ContractFunction<T> },
    args: CrocSwapExecOpts,
  ) {
    const reader = new CrocSlotReader(this.context);
    if (this.callType === 'router') {
      return this.swapCall(base, args);
    } else if (this.callType === 'bypass') {
      return this.swapCall(base, args);
    } else if (
      this.callType === 'proxy' ||
      (await this.context).chain.proxyPaths.dfltColdSwap
    ) {
      return this.userCmdCall(base, args);
    } else {
      return (await reader.isHotPathOpen())
        ? this.swapCall(base, args)
        : this.userCmdCall(base, args);
    }
  }

  private async swapCall<T>(
    base: { [name: string]: ContractFunction<T> },
    args: CrocSwapExecOpts,
  ) {
    const TIP = 0;
    const surplusFlags = this.maskSurplusArgs(args);

    return base.swap(
      this.baseToken.tokenAddr,
      this.quoteToken.tokenAddr,
      this.poolIndex,
      this.sellBase,
      this.qtyInBase,
      await this.qty,
      TIP,
      await this.calcLimitPrice(),
      await this.calcSlipQty(),
      surplusFlags,
      await this.buildTxArgs(surplusFlags, args.gasEst),
      { from: args.from },
    );
  }

  private async userCmdCall<T>(
    base: { [name: string]: ContractFunction<T> },
    args: CrocSwapExecOpts,
  ) {
    const TIP = 0;
    const surplusFlags = this.maskSurplusArgs(args);

    const HOT_PROXY_IDX = 1;

    const abi = new AbiCoder();
    const cmd = abi.encode(
      [
        'address',
        'address',
        'uint256',
        'bool',
        'bool',
        'uint128',
        'uint16',
        'uint128',
        'uint128',
        'uint8',
      ],
      [
        this.baseToken.tokenAddr,
        this.quoteToken.tokenAddr,
        this.poolIndex,
        this.sellBase,
        this.qtyInBase,
        await this.qty,
        TIP,
        await this.calcLimitPrice(),
        await this.calcSlipQty(),
        surplusFlags,
      ],
    );

    const aargs = await this.buildTxArgs(surplusFlags, args.gasEst);

    return base.userCmd(HOT_PROXY_IDX, cmd, {
      gasLimit: args.gasEst,
      value: aargs.value,
    });
  }

  /**
   * Utility function to generate a "signed" raw transaction for a swap, used for L1 gas estimation on L2's like Scroll.
   * Extra 0xFF...F is appended to the unsigned raw transaction to simulate the signature and other missing fields.
   *
   * Note: This function is only intended for L1 gas estimation, and does not generate valid signed transactions.
   */
  async getFauxRawTx(args: CrocSwapExecOpts = {}): Promise<`0x${string}`> {
    const TIP = 0;
    const surplusFlags = this.maskSurplusArgs(args);

    const unsignedTx = await (
      await this.context
    ).dex.populateTransaction.swap(
      this.baseToken.tokenAddr,
      this.poolIndex,
      this.sellBase,
      this.qtyInBase,
      await this.qty,
      TIP,
      await this.calcLimitPrice(),
      await this.calcSlipQty(),
      surplusFlags,
      await this.buildTxArgs(surplusFlags),
    );

    // append 160 'f's to the end of the raw transaction to simulate the signature and other missing fields
    return (getUnsignedRawTransaction(unsignedTx) +
      'f'.repeat(160)) as `0x${string}`;
  }

  async calcImpact(): Promise<CrocImpact> {
    const TIP = 0;
    const limitPrice = this.sellBase ? MAX_SQRT_PRICE : MIN_SQRT_PRICE;

    const impact = await (
      await this.context
    ).slipQuery.calcImpact(
      this.baseToken.tokenAddr,
      this.quoteToken.tokenAddr,
      this.poolIndex,
      this.sellBase,
      this.qtyInBase,
      await this.qty,
      TIP,
      limitPrice,
    );

    const baseQty = this.baseToken.toDisplay(impact.baseFlow.abs());
    const quoteQty = this.quoteToken.toDisplay(impact.quoteFlow.abs());
    const spotPrice = decodeCrocPrice(impact.finalPrice);

    const startPrice = this.poolView.displayPrice();
    const finalPrice = this.poolView.toDisplayPrice(spotPrice);

    return {
      sellQty: this.sellBase ? await baseQty : await quoteQty,
      buyQty: this.sellBase ? await quoteQty : await baseQty,
      finalPrice: await finalPrice,
      percentChange:
        ((await finalPrice) - (await startPrice)) / (await startPrice),
    };
  }

  public maskSurplusArgs(args?: CrocSwapExecOpts): number {
    return encodeSurplusArg(this.maskSurplusFlags(args));
  }

  private maskSurplusFlags(args?: CrocSwapExecOpts): CrocSurplusFlags {
    if (!args || !args.settlement) {
      return [false, false];
    } else if (typeof args.settlement === 'boolean') {
      return [args.settlement, args.settlement];
    } else {
      return this.sellBase
        ? [args.settlement.sellDexSurplus, args.settlement.buyDexSurplus]
        : [args.settlement.buyDexSurplus, args.settlement.sellDexSurplus];
    }
  }

  public async buildTxArgs(surplusArg: number, gasEst?: BigNumber) {
    const txArgs = await this.attachEthMsg(surplusArg);

    if (gasEst) {
      Object.assign(txArgs, { gasLimit: gasEst.add(GAS_PADDING) });
    }

    return txArgs;
  }

  private async attachEthMsg(
    surplusEncoded: number,
  ): Promise<CrocTransactionData> {
    // Only need msg.val if one token is native ETH (will always be base side)
    if (!this.sellBase || this.baseToken.tokenAddr !== AddressZero) {
      return { to: '', data: '', value: BigNumber.from(0) };
    }

    // Calculate the maximum amount of ETH we'll need. If on the floating side
    // account for potential slippage. (Contract will refund unused ETH)
    const val = this.qtyInBase ? this.qty : this.calcSlipQty();

    if (decodeSurplusFlag(surplusEncoded)[0]) {
      // If using surplus calculate the amount of ETH not covered by the surplus
      // collateral.
      const needed = new CrocEthView(this.context).msgValOverSurplus(await val);
      return { to: '', data: '', value: BigNumber.from(needed) };
    } else {
      // Otherwise we need to send the entire balance in msg.val
      return { to: '', data: '', value: await val };
    }
  }

  async calcSlipQty(): Promise<BigNumber> {
    const qtyIsBuy = this.sellBase === this.qtyInBase;

    const slipQty = !qtyIsBuy
      ? parseFloat((await this.impact).sellQty) * (1 + this.slippage)
      : parseFloat((await this.impact).buyQty) * (1 - this.slippage);

    return !this.qtyInBase
      ? this.baseToken.roundQty(slipQty)
      : this.quoteToken.roundQty(slipQty);
  }

  async calcLimitPrice(): Promise<BigNumber> {
    return this.sellBase ? MAX_SQRT_PRICE : MIN_SQRT_PRICE;
  }

  forceProxy(): CrocSwapPlan {
    this.callType = 'proxy';
    return this;
  }

  useRouter(): CrocSwapPlan {
    this.callType = 'router';
    return this;
  }

  useBypass(): CrocSwapPlan {
    this.callType = 'bypass';
    return this;
  }

  readonly baseToken: CrocTokenView;
  readonly quoteToken: CrocTokenView;
  readonly qty: Promise<BigNumber>;
  readonly sellBase: boolean;
  readonly qtyInBase: boolean;
  readonly slippage: number;
  readonly priceSlippage: number;
  readonly poolView: CrocPoolView;
  readonly context: Promise<CrocContext>;
  readonly impact: Promise<CrocImpact>;
  protected callType: string;
}

// Price slippage limit multiplies normal slippage tolerance by the amount that should
// be reasonable (300%)
const PRICE_SLIP_MULT = 3.0;

// Default slippage is set to 1%. Users should evaluate this carefully for low liquidity
// pools or when swapping large amounts.
const DFLT_SWAP_ARGS = {
  slippage: 0.01,
};
