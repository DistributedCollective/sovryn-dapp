import { zeroRedemptionSwapRoute } from './routes/zero-redemption-route';
import { SwapRouteFunction } from './types';

// TODO: Enable all the routes after testing
export const DEFAULT_SWAP_ROUTES: SwapRouteFunction[] = [
  // ammSwapRoute,
  // myntBassetRoute,
  // mocIntegrationSwapRoute,
  zeroRedemptionSwapRoute,
];
