import { AsyncContractConfigData } from '../../../types/config';
import { Network } from '../../networks';
import { rsk } from './rsk';

export const protocol: Partial<
  Record<Network, Record<string, AsyncContractConfigData>>
> = {
  rsk,
};
