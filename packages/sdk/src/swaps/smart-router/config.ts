import { ammSwapRoute } from './routes/amm-swap-route';
import { SwapRouteFunction } from './types';

export const DEFAULT_SWAP_ROUTES: SwapRouteFunction[] = [ammSwapRoute];
