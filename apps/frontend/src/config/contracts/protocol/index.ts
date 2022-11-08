import { AsyncContractConfigData } from '../../../types/config';
import { Network } from '../../networks';
import rsk from './rsk';

const protocol: Partial<
  Record<Network, Record<string, AsyncContractConfigData>>
> = {
  rsk,
};

export default protocol;
