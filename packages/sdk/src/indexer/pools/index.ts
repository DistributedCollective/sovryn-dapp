import { Indexer } from '..';
import {
  makePaginatedUrl,
  PaginatorQuery,
  PaginatorResponse,
} from '../paginator';
import { Pool } from './pool';

export class Pools {
  constructor(protected context: Indexer) {
    //
  }

  public async list(options: PaginatorQuery): Promise<PaginatorResponse<Pool>> {
    const res = await fetch(
      makePaginatedUrl(
        `${this.context.url}/v2/${this.context.chainId}/pools`,
        options,
      ),
    );
    return await res.json();
  }
}
