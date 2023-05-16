import { BigNumber, BigNumberish, providers } from 'ethers';

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
  public getAvailableRoutes(): SwapRoute[] {
    return this.routes;
  }

  // return available routes for given assets
  public async getAvailableRoutesForAssets(
    base: string,
    quote: string,
  ): Promise<SwapRoute[]> {
    const routes = await Promise.all(
      this.routes.map(async route => {
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

  public async getQuotes(
    entry: string,
    destination: string,
    amount: BigNumberish,
  ): Promise<BestRouteQuote[]> {
    const routes = await this.getAvailableRoutesForAssets(entry, destination);

    const quotes = await Promise.all(
      routes.map(async route => {
        const quote = await route.quote(entry, destination, amount);
        return { route, quote };
      }),
    );

    return quotes;
  }

  // return best quote and route for given assets and amount
  public async getBestQuote(
    base: string,
    quote: string,
    amount: BigNumberish,
  ): Promise<BestRouteQuote> {
    const routes = await this.getQuotes(base, quote, amount);

    if (routes.length === 0) {
      throw new Error('No routes available');
    }

    return routes.sort((a, b) => a.quote.sub(b.quote).toNumber())[0];
  }
}
