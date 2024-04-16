import { Environments } from '../../../../types/global';

export type ChainToEndpointMap = Record<Environments, string>;

export const endpoints: ChainToEndpointMap = {
  [Environments.Mainnet]: 'https://runebridge.sovryn.app',
  [Environments.Testnet]: 'http://3.17.99.217',
};
