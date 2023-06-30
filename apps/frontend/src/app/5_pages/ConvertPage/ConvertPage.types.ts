import { SupportedTokens } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { SmartRouter, smartRoutes } from '@sovryn/sdk';

const provider = getProvider();

//export const smartRouter = new SmartRouter(provider, DEFAULT_SWAP_ROUTES);
export const smartRouter = new SmartRouter(provider, [
  smartRoutes.mocIntegrationSwapRoute,
]);

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
