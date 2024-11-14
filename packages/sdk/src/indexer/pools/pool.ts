import { Indexer } from '../indexer';
import { Token } from '../tokens';
import { PoolData } from '../types';

export class Pool {
  #data: PoolData;
  #context: Indexer;

  #base: Token;
  #quote: Token;

  constructor(data: PoolData, context: Indexer) {
    this.#data = data;
    this.#context = context;
    this.#base = this.#context.tokens.addToken(this.#data.base);
    this.#quote = this.#context.tokens.addToken(this.#data.quote);
  }

  get featured() {
    return this.#data.featured;
  }

  get identifier() {
    return this.#data.identifier;
  }

  get type() {
    return this.#data.type;
  }

  get base() {
    return this.#base;
  }

  get quote() {
    return this.#quote;
  }

  get price() {
    return this.#data.price;
  }

  get fee() {
    return this.#data.fee;
  }

  get apr() {
    return this.#data.apr;
  }

  get baseLiquidity() {
    return this.#data.baseLiquidity;
  }

  get quoteLiquidity() {
    return this.#data.quoteLiquidity;
  }

  get baseVolume() {
    return this.#data.baseVolume;
  }

  get quoteVolume() {
    return this.#data.quoteVolume;
  }

  get dailyBaseVolume() {
    return this.#data.dailyBaseVolume;
  }

  get dailyQuoteVolume() {
    return this.#data.dailyQuoteVolume;
  }

  get chainId() {
    return this.#context.chainId;
  }

  get extra() {
    return this.#data.extra;
  }

  toJSON() {
    return {
      featured: this.featured,
      identifier: this.identifier,
      type: this.type,
      base: this.base.toJSON(),
      quote: this.quote.toJSON(),
      price: this.price,
      fee: this.fee,
      apr: this.apr,
      baseLiquidity: this.baseLiquidity,
      quoteLiquidity: this.quoteLiquidity,
      baseVolume: this.baseVolume,
      quoteVolume: this.quoteVolume,
      dailyBaseVolume: this.dailyBaseVolume,
      dailyQuoteVolume: this.dailyQuoteVolume,
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}
