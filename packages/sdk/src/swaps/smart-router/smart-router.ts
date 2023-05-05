import { providers } from 'ethers';

import { SovrynErrorCode, makeError } from '../../errors/errors';
import { DEFAULT_SWAP_ROUTES } from './config';
import { SwapRoute, SwapRouteFunction } from './types';

export type BestRouteQuote = {
  route: SwapRoute;
  quote: string;
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
  public getAvailableRoutesForAssets(base: string, quote: string): SwapRoute[] {
    throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
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
