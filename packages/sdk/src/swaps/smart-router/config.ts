import { ammSwapRoute } from './routes/amm-swap-route';
import { mocIntegrationSwapRoute } from './routes/moc-integration-swap-route';
import { myntBassetRoute } from './routes/mynt-basset-route';
import { myntFixedRateRoute } from './routes/mynt-fixed-rate-route';
import { SwapRouteFunction } from './types';

export const DEFAULT_SWAP_ROUTES: SwapRouteFunction[] = [
  ammSwapRoute,
  myntBassetRoute,
  myntFixedRateRoute,
  mocIntegrationSwapRoute,
];
