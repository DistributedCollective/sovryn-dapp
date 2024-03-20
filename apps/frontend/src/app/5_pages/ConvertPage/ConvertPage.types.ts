import { SupportedTokens } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { SmartRouter, smartRoutes } from '@sovryn/sdk';
import { defaultChainId } from '../../../config/chains';

// todo: request provider dynamically based on the current chain inside of the component instead.
const provider = getProvider(defaultChainId);

const SWAP_ROUTES = [
  smartRoutes.ammSwapRoute,
  smartRoutes.myntBassetRoute,
  smartRoutes.myntFixedRateRoute,
  smartRoutes.mocIntegrationSwapRoute,
  smartRoutes.ambientRoute,
];

export const smartRouter = new SmartRouter(provider, SWAP_ROUTES);

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
