import { ambientRoute } from './routes/ambient';
import { ammSwapRoute } from './routes/amm-swap-route';
import { mocIntegrationSwapRoute } from './routes/moc-integration-swap-route';
import { myntBassetRoute } from './routes/mynt-basset-route';
import { myntFixedRateRoute } from './routes/mynt-fixed-rate-route';
import { zeroRedemptionSwapRoute } from './routes/zero-redemption-route';

export * from './types';
export * from './config';

export * from './smart-router';

export const smartRoutes = {
  ammSwapRoute,
  myntBassetRoute,
  myntFixedRateRoute,
  zeroRedemptionSwapRoute,
  mocIntegrationSwapRoute,
  ambientRoute,
};
