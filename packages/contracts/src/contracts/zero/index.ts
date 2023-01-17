import { Network } from '@sovryn/ethers-provider';

import { AsyncContractConfigData } from '../../types';
import { rsk } from './rsk';
import { rskTestnet } from './rskTestnet';

export const zero: Partial<
  Record<Network, Record<string, AsyncContractConfigData>>
> = {
  rsk,
  rskTestnet,
};
