import { ChainId } from '@sovryn/ethers-provider';

import { findAsset } from '../asset';
import { createSdex } from './sdex';

export const sdexPool = (
  chainId: ChainId,
  baseAddress: string,
  quoteAddress: string,
  poolIndex: number,
) => createSdex(chainId).pool(quoteAddress, baseAddress, poolIndex);

export const sdexPoolFromAsset = (
  chainId: ChainId,
  baseSymbol: string,
  quoteSymbol: string,
  poolIndex: number,
) =>
  sdexPool(
    chainId,
    findAsset(quoteSymbol, chainId).address,
    findAsset(baseSymbol, chainId).address,
    poolIndex,
  );
