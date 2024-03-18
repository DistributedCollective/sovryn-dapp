import { ChainId } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../config/chains';

import { normalizeAsset } from '../utils/asset';

export const getTokenDisplayName = (
  token: string,
  chainId: ChainId = RSK_CHAIN_ID,
): string => normalizeAsset(token, chainId)?.symbol || token.toUpperCase();
