import { Network } from '@sovryn/ethers-provider';

import { AsyncContractConfigData } from '../../types';
import { rsk } from './rsk';

export const protocol: Partial<
  Record<Network, Record<string, AsyncContractConfigData>>
> = {
  rsk,
};
