import { getProvider } from '@sovryn/ethers-provider';
import { ChainIds } from '@sovryn/ethers-provider';
import { SmartRouter, smartRoutes } from '@sovryn/sdk';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { COMMON_SYMBOLS } from '../../../utils/asset';

export const FIXED_RATE_ROUTES = ['MyntBasset', 'MyntFixedRate'];

export const FIXED_MYNT_RATE = '0.004723550439442834'; // We need it here as well because ConvertPage slightly rounds maximum price

export const SWAP_ROUTES = [
  smartRoutes.ammSwapRoute,
  smartRoutes.myntBassetRoute,
  smartRoutes.myntFixedRateRoute,
  smartRoutes.mocIntegrationSwapRoute,
  smartRoutes.ambientRoute,
  smartRoutes.joeRoute,
  // smartRoutes.zeroRedemptionSwapRoute,
];

export const SMART_ROUTER_RSK = new SmartRouter(
  getProvider(RSK_CHAIN_ID),
  SWAP_ROUTES,
);

export const SMART_ROUTER_STABLECOINS = [
  COMMON_SYMBOLS.ZUSD,
  COMMON_SYMBOLS.DLLR,
  COMMON_SYMBOLS.XUSD,
  COMMON_SYMBOLS.DOC,
  'RDOC',
  COMMON_SYMBOLS.RUSDT,
  'USDT',
  'USDC',
  'DAI',
];

export const BASSETS = [COMMON_SYMBOLS.ZUSD, COMMON_SYMBOLS.DOC];
export const MASSET = COMMON_SYMBOLS.DLLR;

export const SMART_ROUTER_ALLOWED_TOKENS = [...BASSETS, MASSET];

export const DEFAULT_SWAP_ENTRIES: Partial<Record<ChainIds, string>> = {
  [ChainIds.RSK_MAINNET]: COMMON_SYMBOLS.DLLR,
  [ChainIds.RSK_TESTNET]: COMMON_SYMBOLS.DLLR,
  [ChainIds.BOB_MAINNET]: COMMON_SYMBOLS.ETH,
  [ChainIds.BOB_TESTNET]: COMMON_SYMBOLS.ETH,
  [ChainIds.SEPOLIA]: COMMON_SYMBOLS.ETH,
};
