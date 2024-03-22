import { ChainId } from '@sovryn/ethers-provider';

import { RSK_CHAIN_ID } from '../config/chains';

import { findAsset } from '../utils/asset';

export const getTokenDisplayName = (
  token: string,
  chainId: ChainId = RSK_CHAIN_ID,
): string => findAsset(token, chainId)?.symbol || token.toUpperCase();
