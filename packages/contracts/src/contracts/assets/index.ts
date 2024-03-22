import { Network } from '@sovryn/ethers-provider';

import { AssetDetails } from '../../types';
import { bobTestnet } from './bobTestnet';
import { eth } from './eth';
import { rsk } from './rsk';
import { rskTestnet } from './rskTestnet';
import { sepolia } from './sepolia';

export const assets: Partial<Record<Network, Array<AssetDetails>>> = {
  rsk,
  rskTestnet,
  bobTestnet,
  eth,
  sepolia,
};
