import { ChainId } from '@sovryn/ethers-provider';
import { prettyTx } from '@sovryn/ui';

import { BOB_CHAIN_ID, RSK_CHAIN_ID } from '../config/chains';

import { findAsset, findAssetByAddress } from '../utils/asset';

export const getTokenDisplayName = (
  token: string,
  chainId: ChainId = RSK_CHAIN_ID,
): string => findAsset(token, chainId)?.symbol || token.toUpperCase();

export const getTokenDisplayNameByAddress = (
  address: string,
  chainId: ChainId = BOB_CHAIN_ID,
  fallbackPrettified = true,
): string =>
  findAssetByAddress(address, chainId)?.symbol || fallbackPrettified
    ? prettyTx(address)
    : address;
