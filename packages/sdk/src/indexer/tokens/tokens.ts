import { Indexer } from '../indexer';
import {
  makePaginatedUrl,
  PaginatorQuery,
  PaginatorResponse,
} from '../paginator';
import { TokenData } from '../types';
import { Token } from './token';

export class TokenList {
  #context: Indexer;
  #queried = false;
  #tokens = new Map<string, Token>();

  constructor(context: Indexer) {
    this.#context = context;
    this.queryAll({ limit: 1000 }).catch(console.error);
  }

  public addToken(details: TokenData): Token {
    const id = details.address.toLowerCase();
    if (!this.#tokens.has(id)) {
      this.#tokens.set(id, new Token(details, this.#context));
    } else {
      this.#tokens.set(
        id,
        new Token({ ...this.#tokens.get(id), ...details }, this.#context),
      );
    }

    return this.#tokens.get(id)!;
  }

  public getToken(address: string): Token | undefined {
    return this.#tokens.get(address.toLowerCase());
  }

  public async list() {
    if (!this.#queried) {
      await this.queryAll({ limit: 1000 }).catch(console.error);
    }
    return Array.from(this.#tokens.values());
  }

  public async query(
    options?: PaginatorQuery,
  ): Promise<PaginatorResponse<Token>> {
    const res = await fetch(
      makePaginatedUrl(
        `${this.#context.url}/v2/${this.#context.chainId}/tokens`,
        options,
      ),
    );
    return await res.json().then(data => {
      return {
        data: data.data.map((item: TokenData) => this.addToken(item)),
        cursor: data.cursor,
      };
    });
  }

  public async queryAll(
    options?: PaginatorQuery,
  ): Promise<PaginatorResponse<Token>> {
    const res = await fetch(
      makePaginatedUrl(
        `${this.#context.url}/v2/${this.#context.chainId}/tokens/all`,
        options,
      ),
    );
    return await res
      .json()
      .then(data => {
        return {
          data: data.data.map((item: TokenData) => this.addToken(item)),
          cursor: data.cursor,
        };
      })
      .finally(() => {
        this.#queried = true;
      });
  }
}
