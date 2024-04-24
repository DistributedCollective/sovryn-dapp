import { AddressZero } from '@ethersproject/constants';
import { TransactionResponse } from '@ethersproject/providers';

import { Signer } from 'ethers';

import { ConnectArg, CrocContext, connectCroc } from './context';
import { CrocKnockoutHandle } from './knockout';
import { CrocPoolView } from './pool';
import { CrocPositionView } from './position';
import { CrocSlotReader } from './slots';
import { CrocSwapPlan, CrocSwapPlanOpts } from './swap';
import { TokenQty, CrocTokenView } from './tokens';

/* This is the main entry point for the Croc SDK. It provides a high-level interface
 * for interacting with CrocSwap smart contracts in an ergonomic way. */
export class CrocEnv {
  constructor(private conn: ConnectArg, signer?: Signer) {
    this.context = connectCroc(conn, signer);
    this.tokens = new TokenRepo(this.context);
  }

  connect(signer: Signer): CrocEnv {
    return new CrocEnv(this.conn, signer);
  }

  /* Generates a prefix object for a swap with a fixed buy quantity.
   * Example of generating a swap plan for buying 100 USDC by swapping DAI:
   *    crocEnv.buy(USDC, 100).with(DAI)
   *
   * @param token The address of the token to buy.
   * @param qty The fixed quantity of the token to buy. */
  buy(token: string, qty: TokenQty, poolIndex: number): BuyPrefix {
    return new BuyPrefix(token, qty, this.tokens, poolIndex, this.context);
  }

  /* Generates a prefix object for a swap with a fixed buy quantity of native ETH.
   * Example of generating a swap plan for buying 100 USDC by swapping DAI:
   *    crocEnv.buyEth(100).with(DAI)
   *
   * @param qty The fixed quantity of native ETH to buy. */
  buyEth(qty: TokenQty, poolIndex: number): BuyPrefix {
    return new BuyPrefix(
      AddressZero,
      qty,
      this.tokens,
      poolIndex,
      this.context,
    );
  }

  /* Generates a prefix object for a swap with a fixed sell quantity.
   * Example of generating a swap plan for selling 100 USDC to swap into DAI:
   *    crocEnv.sell(USDC, 100).for(DAI)
   *
   * @param token The address of the token to sell.
   * @param qty The fixed quantity of the token to sell. */
  sell(token: string, qty: TokenQty, poolIndex: number): SellPrefix {
    return new SellPrefix(token, qty, this.tokens, poolIndex, this.context);
  }

  /* Generates a prefix object for a swap with a fixed sell quantity of native ETH.
   * Example of generating a swap plan for selling 100 native ETH to swap into DAI:
   *    crocEnv.sellEth(100).for(DAI)
   *
   * @param qty The fixed quantity of native ETH to sell. */
  sellEth(qty: TokenQty, poolIndex: number): SellPrefix {
    return new SellPrefix(
      AddressZero,
      qty,
      this.tokens,
      poolIndex,
      this.context,
    );
  }

  /* Returns a view of the canonical pool for the underlying token pair. For example the
   * below would return pool view for WBTC/USDC with WBTC as the quote side token:
   *        crocEnv.pool(WBTC, USDC)
   *
   * @param tokenQuote The address of the token to use as the quote token in the
   *                   view. Note the quote or base side only matters for display price
   *                   purposes.
   * @param tokenBase The address of the token to use as the base token in the view. */
  pool(tokenQuote: string, tokenBase: string, poolIndex: number): CrocPoolView {
    const viewA = this.tokens.materialize(tokenQuote);
    const viewB = this.tokens.materialize(tokenBase);
    return new CrocPoolView(viewA, viewB, poolIndex, this.context);
  }

  /* Returns a view of the canonical pool for the token pair against native ETH. For example
   * the below woudl return a pool view for MKR/ETH with MKR priced in ETH for display purposes
   *       crocEnv.poolEth(MKR) */
  poolEth(token: string, poolIndex: number): CrocPoolView {
    return this.pool(token, AddressZero, poolIndex);
  }

  /* Returns a view of the canonical pool for the token pair against native ETH, but ETH is
   * priced in terms of the token. Usually the convention when ETH is paired against stablecoins
   * or paired against Bitcoin. For example the below would return a pool view for ETH/USDC
   *       crocEnv.poolEthQuote(USDC) */
  poolEthQuote(token: string, poolIndex: number): CrocPoolView {
    return this.pool(AddressZero, token, poolIndex);
  }

  /* Returns a position view for a single user on the canonical pool for a single pair. */
  positions(
    tokenQuote: string,
    tokenBase: string,
    owner: string,
    poolIndex: number,
  ): CrocPositionView {
    return new CrocPositionView(
      this.tokens.materialize(tokenQuote),
      this.tokens.materialize(tokenBase),
      owner,
      poolIndex,
      this.context,
    );
  }

  /* Returns a tokenView for a single token
   * @param token The address of the specifc token. */
  token(token: string): CrocTokenView {
    return this.tokens.materialize(token);
  }

  /* Returns a tokenView for native ETH. */
  tokenEth(): CrocTokenView {
    return this.tokens.materialize(AddressZero);
  }

  async approveBypassRouter(): Promise<TransactionResponse | undefined> {
    return this.tokenEth().approveBypassRouter();
  }

  slotReader(): CrocSlotReader {
    return new CrocSlotReader(this.context);
  }

  readonly context: Promise<CrocContext>;
  tokens: TokenRepo;
}

class BuyPrefix {
  constructor(
    token: string,
    qty: TokenQty,
    repo: TokenRepo,
    poolIndex: number,
    context: Promise<CrocContext>,
  ) {
    this.token = token;
    this.qty = qty;
    this.context = context;
    this.poolIndex = poolIndex;
    this.repo = repo;
  }

  with(token: string, args?: CrocSwapPlanOpts): CrocSwapPlan {
    return new CrocSwapPlan(
      this.repo.materialize(token),
      this.repo.materialize(this.token),
      this.qty,
      true,
      this.poolIndex,
      this.context,
      args,
    );
  }

  withEth(args?: CrocSwapPlanOpts): CrocSwapPlan {
    return this.with(AddressZero, args);
  }

  atLimit(token: string, tick: number): CrocKnockoutHandle {
    return new CrocKnockoutHandle(
      this.repo.materialize(token),
      this.repo.materialize(this.token),
      this.qty,
      false,
      tick,
      this.context,
    );
  }

  readonly token: string;
  readonly qty: TokenQty;
  readonly context: Promise<CrocContext>;
  readonly poolIndex: number;
  repo: TokenRepo;
}

class SellPrefix {
  constructor(
    token: string,
    qty: TokenQty,
    repo: TokenRepo,
    poolIndex: number,
    context: Promise<CrocContext>,
  ) {
    this.token = token;
    this.qty = qty;
    this.poolIndex = poolIndex;
    this.context = context;
    this.repo = repo;
  }

  for(token: string, args?: CrocSwapPlanOpts): CrocSwapPlan {
    return new CrocSwapPlan(
      this.repo.materialize(this.token),
      this.repo.materialize(token),
      this.qty,
      false,
      this.poolIndex,
      this.context,
      args,
    );
  }
  forEth(args?: CrocSwapPlanOpts): CrocSwapPlan {
    return this.for(AddressZero, args);
  }

  atLimit(token: string, tick: number): CrocKnockoutHandle {
    return new CrocKnockoutHandle(
      this.repo.materialize(this.token),
      this.repo.materialize(token),
      this.qty,
      true,
      tick,
      this.context,
    );
  }

  readonly token: string;
  readonly qty: TokenQty;
  readonly poolIndex: number;
  readonly context: Promise<CrocContext>;
  repo: TokenRepo;
}

/* Use this to cache the construction of CrocTokenView objects across CrocEnv lifetime.
 * Because token view construction makes on-chain calls to get token metadata, doing this
 * drastically reduces the number of RPC calls. */
class TokenRepo {
  constructor(context: Promise<CrocContext>) {
    this.tokenViews = new Map<string, CrocTokenView>();
    this.context = context;
  }

  /* Either generates or loads a previously cached token view object.
   * @param tokenAddr The Ethereum address of the token contract. */
  materialize(tokenAddr: string): CrocTokenView {
    let tokenView = this.tokenViews.get(tokenAddr);
    if (!tokenView) {
      tokenView = new CrocTokenView(this.context, tokenAddr);
      this.tokenViews.set(tokenAddr, tokenView);
    }
    return tokenView;
  }

  tokenViews: Map<string, CrocTokenView>;
  context: Promise<CrocContext>;
}
