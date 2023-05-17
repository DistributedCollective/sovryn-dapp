import { ammSwapRoute } from './routes/amm-swap-route';
import { zeroRedemptionSwapRoute } from './routes/zero-redemption-route';

export * from './types';
export * from './config';

export * from './smart-router';

export const smartRoutes = {
  ammSwapRoute,
  zeroRedemptionSwapRoute,
};
