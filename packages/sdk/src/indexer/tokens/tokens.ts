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

  #abortController: AbortController | null = null;
  #request: Promise<PaginatorResponse<Token>> | null = null;

  #abortControllerAll: AbortController | null = null;
  #requestAll: Promise<PaginatorResponse<Token>> | null = null;

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
    if (this.#request) {
      return this.#request;
    }

    if (this.#abortController) {
      this.#abortController.abort();
    }

    this.#abortController = new AbortController();

    this.#request = fetch(
      makePaginatedUrl(
        `${this.#context.url}/v2/${this.#context.chainId}/tokens`,
        options,
      ),
      { signal: this.#abortController.signal },
    )
      .then(res => res.json())
      .then(data => {
        return {
          data: data.data.map((item: TokenData) => this.addToken(item)),
          cursor: data.cursor,
        };
      });

    return this.#request;
  }

  public async queryAll(
    options?: PaginatorQuery,
  ): Promise<PaginatorResponse<Token>> {
    if (this.#requestAll) {
      return this.#requestAll;
    }

    if (this.#abortControllerAll) {
      this.#abortControllerAll.abort();
    }

    this.#abortControllerAll = new AbortController();

    this.#requestAll = fetch(
      makePaginatedUrl(
        `${this.#context.url}/v2/${this.#context.chainId}/tokens/all`,
        options,
      ),
      { signal: this.#abortControllerAll.signal },
    )
      .then(res => res.json())
      .then(data => {
        return {
          data: data.data.map((item: TokenData) => this.addToken(item)),
          cursor: data.cursor,
        };
      })
      .finally(() => {
        this.#queried = true;
      });

    return this.#requestAll;
  }
}
