import { Environments } from '../../../../types/global';

export type ChainToEndpointMap = Record<Environments, string>;

export const endpoints: ChainToEndpointMap = {
  [Environments.Mainnet]: 'https://fastbtc.sovryn.app',
  [Environments.Testnet]: 'https://fastbtc.test.sovryn.app',
};
