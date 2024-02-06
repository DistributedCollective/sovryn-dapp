import { BigNumber, BigNumberish, providers } from 'ethers';

import {
  TokenDetailsData,
  getTokenDetailsByAddress,
  getTokenDetails,
} from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';

import { stableCoins } from '../../constants';
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

  // get list of quotes for available routes sorted by best quote
  public async getQuotes(
    entry: string,
    destination: string,
    amount: BigNumberish,
  ): Promise<BestRouteQuote[]> {
    const routes = await this.getAvailableRoutesForAssets(entry, destination);

    const quotes = await Promise.all(
      routes.map(async route => {
        const quote = await route
          .quote(entry, destination, amount)
          .catch(console.error);
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
    base: string,
    quote: string,
    amount: BigNumberish,
  ): Promise<BestRouteQuote> {
    const routes = await this.getQuotes(base, quote, amount);

    if (routes.length === 0) {
      throw new Error('No routes available');
    }

    return routes[0];
  }

  // return all available pairs on enabled routes
  public async getPairs(): Promise<Map<string, string[]>> {
    const pairs = new Map<string, string[]>();
    await Promise.all(
      this.routes.map(async route => {
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
  public async getEntries(): Promise<string[]> {
    return Array.from((await this.getPairs()).keys());
  }

  // return all available destinations for entry token
  public async getDestination(
    entry: string,
    chainId?: ChainId,
  ): Promise<string[]> {
    const stableCoinsDetails = await this.getStableCoinsDetails(chainId);
    const isStableCoin = stableCoinsDetails.find(
      token => token.address.toLowerCase() === entry.toLowerCase(),
    );

    const destinations = ((await this.getPairs()).get(entry) ?? []).filter(
      destinationToken =>
        !isStableCoin ||
        !stableCoinsDetails.find(
          token =>
            token.address.toLowerCase() === destinationToken.toLowerCase(),
        ),
    );

    return destinations;
  }

  public async getTokenDetails(token: string): Promise<TokenDetailsData> {
    return getTokenDetailsByAddress(token);
  }

  private async getStableCoinsDetails(
    chainId?: ChainId,
  ): Promise<TokenDetailsData> {
    return await Promise.all(
      stableCoins.map(token => getTokenDetails(token, chainId)),
    );
  }
}
