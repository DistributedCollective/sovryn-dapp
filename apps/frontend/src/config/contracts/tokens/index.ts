import { Network } from '../../networks';
import { rsk } from './rsk';
import { rskTestnet } from './rskTestnet';

export const tokens: Partial<Record<Network, Record<string, string>>> = {
  rsk,
  rskTestnet,
};
