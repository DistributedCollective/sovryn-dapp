import { SupportedTokens } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { ChainIds } from '@sovryn/ethers-provider';
import { SmartRouter, smartRoutes } from '@sovryn/sdk';

import { RSK_CHAIN_ID } from '../../../config/chains';

export const FIXED_RATE_ROUTES = ['MyntBasset', 'MyntFixedRate'];

export const FIXED_MYNT_RATE = '0.004723550439442834'; // We need it here as well because ConvertPage slightly rounds maximum price

export const SWAP_ROUTES = [
  smartRoutes.ammSwapRoute,
  smartRoutes.myntBassetRoute,
  smartRoutes.myntFixedRateRoute,
  smartRoutes.mocIntegrationSwapRoute,
  smartRoutes.ambientRoute,
];

export const SMART_ROUTER_RSK = new SmartRouter(
  getProvider(RSK_CHAIN_ID),
  SWAP_ROUTES,
);

export const SMART_ROUTER_STABLECOINS = [
  SupportedTokens.zusd,
  SupportedTokens.dllr,
  SupportedTokens.xusd,
  SupportedTokens.doc,
  SupportedTokens.rdoc,
  SupportedTokens.rusdt,
];

export const BASSETS = [SupportedTokens.zusd, SupportedTokens.doc];
export const MASSET = SupportedTokens.dllr;

export const SMART_ROUTER_ALLOWED_TOKENS = [...BASSETS, MASSET];

export const DEFAULT_SWAP_ENTRIES: Partial<Record<ChainIds, SupportedTokens>> =
  {
    [ChainIds.RSK_MAINNET]: SupportedTokens.dllr,
    [ChainIds.RSK_TESTNET]: SupportedTokens.dllr,
    [ChainIds.BOB_MAINNET]: SupportedTokens.btc,
    [ChainIds.BOB_TESTNET]: SupportedTokens.btc,
  };
