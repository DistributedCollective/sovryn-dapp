import { GRAPH_WRAPPER } from '../../../constants/infrastructure';
import { Environments } from '../../../types/global';

const graphWrapper = GRAPH_WRAPPER[Environments.Mainnet];

export const VOLUME_DATA_URL = `${graphWrapper}/cmc/summary`;
export const ASSET_DATA_URL = `${graphWrapper}/cmc/asset`;
