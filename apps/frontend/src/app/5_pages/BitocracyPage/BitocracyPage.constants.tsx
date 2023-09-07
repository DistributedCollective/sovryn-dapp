import { Environments } from '../../../types/global';

export const BLOCK_TIME_IN_SECONDS = 30;

export const GovernorContractAdminAddress = {
  [Environments.Mainnet]: '0xfF25f66b7D7F385503D70574AE0170b6B1622dAd',
  [Environments.Testnet]: '0x1528f0341a1Ea546780caD690F54b4FBE1834ED4',
};

export const GovernorContractOwnerAddress = {
  [Environments.Mainnet]: '0x6496DF39D000478a7A7352C01E0E713835051CcD',
  [Environments.Testnet]: '0x058FD3F6a40b92b311B49E5e3E064300600021D7',
};
