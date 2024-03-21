import type { Network } from '@sovryn/ethers-provider';

import { bobTestnet } from './bobTestnet';
import { eth } from './eth';
import { rsk } from './rsk';
import { rskTestnet } from './rskTestnet';
import { sepolia } from './sepolia';

export const tokens: Partial<Record<Network, Record<string, string>>> = {
  rsk,
  rskTestnet,
  eth,
  sepolia,
  bobTestnet,
};
