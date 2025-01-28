import { Indexer } from '../indexer';
import { TokenData } from '../types';

export class Token {
  #context: Indexer;
  #data: TokenData;

  constructor(data: TokenData, context: Indexer) {
    this.#context = context;
    this.#data = data;
  }

  get address() {
    return this.#data.address.toLowerCase();
  }
  get symbol() {
    return this.#data.symbol;
  }
  get name() {
    return this.#data.name;
  }
  get decimals() {
    return this.#data.decimals ?? 18;
  }
  get logoUrl() {
    return this.#data.logoUrl;
  }
  get usdPrice() {
    return this.#data.usdPrice;
  }
  get isTradeable() {
    return this.#data.isTradeable;
  }

  get chainId() {
    return this.#context.chainId;
  }

  toJSON() {
    return this.#data;
  }

  toString() {
    return JSON.stringify(this.#data);
  }
}
