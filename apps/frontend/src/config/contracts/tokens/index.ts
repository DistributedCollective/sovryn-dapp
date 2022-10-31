import { Network } from '../../networks';
import rsk from './rsk';
import rskTestnet from './rsk';

const tokens: Partial<Record<Network, Record<string, string>>> = {
  rsk,
  rskTestnet,
};

export default tokens;
