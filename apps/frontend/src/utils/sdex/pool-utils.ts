import { ChainId } from '@sovryn/ethers-provider';

import { findAsset } from '../asset';
import { createSdex } from './sdex';

export const sdexPool = (
  chainId: ChainId,
  baseAddress: string,
  quoteAddress: string,
) => createSdex(chainId).pool(quoteAddress, baseAddress);

export const sdexPoolFromAsset = (
  chainId: ChainId,
  baseSymbol: string,
  quoteSymbol: string,
) =>
  sdexPool(
    chainId,
    findAsset(quoteSymbol, chainId).address,
    findAsset(baseSymbol, chainId).address,
  );
