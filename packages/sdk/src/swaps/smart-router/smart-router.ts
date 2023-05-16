import { BigNumber, providers } from 'ethers';

import { SovrynErrorCode, makeError } from '../../errors/errors';
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

  // return best quote and route for given assets and amount
  public getBestQuote(
    base: string,
    quote: string,
    amount: string,
  ): Promise<BestRouteQuote> {
    throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
  }
}
