import { BigNumber, BigNumberish, providers } from 'ethers';

import { AssetDetailsData, getAssetDataByAddress } from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';

import { DEFAULT_SWAP_ROUTES } from './config';
import { SwapRoute, SwapRouteFunction } from './types';

export type BestRouteQuote = {
  route: SwapRoute;
  quote: BigNumber;
};

export class SmartRouter {
  protected routes: SwapRoute[] = [];
  constructor(
    protected provider: providers.Provider,
    availableRoutes: SwapRouteFunction[] = DEFAULT_SWAP_ROUTES,
  ) {
    this.routes = availableRoutes.map(route => route(provider));
  }

  // return all available routes
  public getAvailableRoutes(chain: ChainId): SwapRoute[] {
    return this.routes.filter(route => route.chains.includes(chain));
  }

  // return available routes for given assets
  public async getAvailableRoutesForAssets(
    chain: ChainId,
    base: string,
    quote: string,
  ): Promise<SwapRoute[]> {
    const routes = await Promise.all(
      this.getAvailableRoutes(chain).map(async route => {
        const pairs = await route.pairs();
        if (pairs.has(base)) {
          const quoteTokens = pairs.get(base);
          if (quoteTokens?.includes(quote)) {
            return route;
          }
        }
      }),
    );
    return routes.filter(route => route !== undefined) as SwapRoute[];
  }

  // get list of quotes for available routes sorted by best quote
  public async getQuotes(
    chain: ChainId,
    entry: string,
    destination: string,
    amount: BigNumberish,
  ): Promise<BestRouteQuote[]> {
    const routes = await this.getAvailableRoutesForAssets(
      chain,
      entry,
      destination,
    );

    const quotes = await Promise.all(
      routes.map(async route => {
        const quote = await route.quote(entry, destination, amount).catch();
        if (!quote) {
          return { route, quote: BigNumber.from(0) };
        }
        return { route, quote };
      }),
    );

    const sortedQuotes = quotes.sort((a, b) =>
      b.quote.toBigInt() > a.quote.toBigInt() ? 0 : -1,
    );

    return sortedQuotes.filter(quote => quote.quote.gt(0));
  }

  // return best quote and route for given assets and amount
  public async getBestQuote(
    chain: ChainId,
    base: string,
    quote: string,
    amount: BigNumberish,
  ): Promise<BestRouteQuote> {
    const routes = await this.getQuotes(chain, base, quote, amount);

    if (routes.length === 0) {
      throw new Error('No routes available');
    }

    return routes[0];
  }

  // return all available pairs on enabled routes
  public async getPairs(chain: ChainId): Promise<Map<string, string[]>> {
    const pairs = new Map<string, string[]>();
    await Promise.all(
      this.getAvailableRoutes(chain).map(async route => {
        const routePairs = await route.pairs();
        routePairs.forEach((quoteTokens, baseToken) => {
          const existingQuoteTokens = pairs.get(baseToken);
          if (existingQuoteTokens) {
            pairs.set(
              baseToken,
              existingQuoteTokens.concat(
                quoteTokens.filter(
                  item => existingQuoteTokens.indexOf(item) < 0,
                ),
              ),
            );
          } else {
            pairs.set(baseToken, quoteTokens);
          }
        });
      }),
    );
    return pairs;
  }

  // return all available entries
  public async getEntries(chain: ChainId): Promise<string[]> {
    return Array.from((await this.getPairs(chain)).keys());
  }

  // return all available destinations for entry token
  public async getDestination(
    chain: ChainId,
    entry: string,
  ): Promise<string[]> {
    return (await this.getPairs(chain)).get(entry) ?? [];
  }

  public async getTokenDetails(
    token: string,
    chain: ChainId,
  ): Promise<AssetDetailsData> {
    return getAssetDataByAddress(token, chain);
  }
}
