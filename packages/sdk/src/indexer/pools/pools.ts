import { Indexer, PoolData } from '..';
import {
  makePaginatedUrl,
  PaginatorQuery,
  PaginatorResponse,
} from '../paginator';
import { Pool } from './pool';

export class PoolList {
  #quered = false;
  #pools = new Map<string, Pool>();
  #context: Indexer;

  constructor(context: Indexer) {
    this.#context = context;
    this.query({ limit: 1000 }).catch(console.error);
  }

  public addPool(details: PoolData): Pool {
    const id = details.identifier.toLowerCase();
    if (!this.#pools.has(id)) {
      this.#pools.set(id, new Pool(details, this.#context));
    } else {
      this.#pools.set(
        id,
        new Pool({ ...this.#pools.get(id), ...details }, this.#context),
      );
    }

    return this.#pools.get(id)!;
  }

  public getPool(address: string): Pool | undefined {
    return this.#pools.get(address.toLowerCase());
  }

  public async list() {
    if (!this.#quered) {
      await this.query({ limit: 1000 }).catch(console.error);
    }
    return Array.from(this.#pools.values());
  }

  public async query(
    options?: PaginatorQuery,
  ): Promise<PaginatorResponse<Pool>> {
    const res = await fetch(
      makePaginatedUrl(
        `${this.#context.url}/v2/${this.#context.chainId}/pools`,
        options,
      ),
    );
    return await res
      .json()
      .then(data => {
        return {
          data: data.data.map((item: PoolData) => this.addPool(item)),
          cursor: data.cursor,
        };
      })
      .finally(() => {
        this.#quered = true;
      });
  }
}
