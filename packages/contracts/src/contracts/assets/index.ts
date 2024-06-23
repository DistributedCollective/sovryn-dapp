import { Network } from '@sovryn/ethers-provider';

import { AssetDetails } from '../../types';
import { bitlayer } from './bitlayer';
import { bitlayerTestnet } from './bitlayerTestnet';
import { bob } from './bob';
import { bobTestnet } from './bobTestnet';
import { eth } from './eth';
import { fork } from './fork';
import { rsk } from './rsk';
import { rskTestnet } from './rskTestnet';
import { sepolia } from './sepolia';

export const assets: Partial<Record<Network, Array<AssetDetails>>> = {
  rsk,
  rskTestnet,
  bob,
  bobTestnet,
  eth,
  sepolia,
  fork,
  bitlayer,
  bitlayerTestnet,
};
