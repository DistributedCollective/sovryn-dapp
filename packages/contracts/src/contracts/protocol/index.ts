import { Network } from '@sovryn/ethers-provider';

import { AsyncContractConfigData } from '../../types';
import { bobTestnet } from './bobTestnet';
import { rsk } from './rsk';
import { rskTestnet } from './rskTestnet';

export const protocol: Partial<
  Record<Network, Record<string, AsyncContractConfigData>>
> = {
  rsk,
  rskTestnet,
  bobTestnet,
};
