import { AsyncContractConfigData } from '../../../types/config';
import rsk from './rsk';

const protocol: Record<string, Record<string, AsyncContractConfigData>> = {
  rsk,
};

export default protocol;
