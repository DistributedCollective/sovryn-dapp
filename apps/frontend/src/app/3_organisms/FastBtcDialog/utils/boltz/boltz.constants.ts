import { ChainIds } from '@sovryn/ethers-provider';

import { defaultChainId } from '../../../../../config/chains';

export const BOLTZ_EXCHANGE_URLS = {
  [ChainIds.RSK_MAINNET]: 'https://boltz.exchange/',
  [ChainIds.RSK_TESTNET]: 'https://testnet.boltz.exchange/',
};

export const BOLTZ_EXCHANGE_URL = BOLTZ_EXCHANGE_URLS[defaultChainId];
