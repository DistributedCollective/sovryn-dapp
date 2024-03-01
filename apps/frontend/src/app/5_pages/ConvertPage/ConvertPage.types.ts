import { SupportedTokens } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { SmartRouter, smartRoutes } from '@sovryn/sdk';

import { rskChainId } from '../../../config/chains';

export const SWAP_ROUTES = [
  smartRoutes.ammSwapRoute,
  smartRoutes.myntBassetRoute,
  smartRoutes.myntFixedRateRoute,
  smartRoutes.mocIntegrationSwapRoute,
  smartRoutes.ambientRoute,
];

export const smartRouterRsk = new SmartRouter(
  getProvider(rskChainId),
  SWAP_ROUTES,
);

export const stableCoins = [
  SupportedTokens.zusd,
  SupportedTokens.dllr,
  SupportedTokens.xusd,
  SupportedTokens.doc,
  SupportedTokens.rdoc,
  SupportedTokens.rusdt,
];

export const bassets = [SupportedTokens.zusd, SupportedTokens.doc];
export const masset = SupportedTokens.dllr;

export const allowedTokens = [...bassets, masset];
