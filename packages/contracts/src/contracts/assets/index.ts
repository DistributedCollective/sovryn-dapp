import { Network } from '@sovryn/ethers-provider';

import { AssetDetails } from '../../types';
import { bob } from './bob';
import { bobTestnet } from './bobTestnet';
import { bsc } from './bsc';
import { bscTestnet } from './bscTestnet';
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
  bsc,
  bscTestnet,
};
