import { Environments } from '../../../../types/global';

export type ChainToEndpointMap = Record<Environments, string>;

export const endpoints: ChainToEndpointMap = {
  [Environments.Mainnet]: 'https://runebridge.sovryn.app',
  [Environments.Testnet]: 'http://3.17.99.217',
};

export const contractAddresses = {
  [Environments.Mainnet]: '0x26f5b5d6558e87bDA3066B0880F4DDcf971b5Efb',
  [Environments.Testnet]: '0xBF6291ba5a47f6034abd23a71d2a720b42918533',
};
