import { Network } from '@sovryn/ethers-provider';

import { AsyncContractConfigData } from '../../types';
import { bobTestnet } from './bobTestnet';
import { fork } from './fork';
import { rsk } from './rsk';
import { rskTestnet } from './rskTestnet';
import { sepolia } from './sepolia';

export const protocol: Partial<
  Record<Network, Record<string, AsyncContractConfigData>>
> = {
  rsk,
  rskTestnet,
  bobTestnet,
  sepolia,
  fork,
};
