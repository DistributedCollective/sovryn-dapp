import type { Network } from '@sovryn/ethers-provider';

import { rsk } from './rsk';
import { rskTestnet } from './rskTestnet';
import { sepolia } from './sepolia';
import { eth } from './eth';

export const tokens: Partial<Record<Network, Record<string, string>>> = {
  rsk,
  rskTestnet,
  eth,
  sepolia,
};
