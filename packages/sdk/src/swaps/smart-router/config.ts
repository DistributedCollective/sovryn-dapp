import { ammSwapRoute } from './routes/amm-swap-route';
import { myntBassetRoute } from './routes/mynt-basset-route';
import { zeroRedemptionSwapRoute } from './routes/zero-redemption-route';
import { SwapRouteFunction } from './types';

export const DEFAULT_SWAP_ROUTES: SwapRouteFunction[] = [
  ammSwapRoute,
  myntBassetRoute,
  zeroRedemptionSwapRoute,
];
