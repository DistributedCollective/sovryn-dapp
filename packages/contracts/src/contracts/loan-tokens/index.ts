import type { Network } from '@sovryn/ethers-provider';

import { rsk } from './rsk';
import { rskTestnet } from './rskTestnet';

export const loanTokens: Partial<Record<Network, Record<string, string>>> = {
  rsk,
  rskTestnet,
};
