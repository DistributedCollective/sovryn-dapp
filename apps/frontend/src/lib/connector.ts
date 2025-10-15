import bitgetModule from '@sovryn/onboard-bitget';
import Onboard from '@sovryn/onboard-core';
import { Asset, BasePath } from '@sovryn/onboard-hw-common';
import injectedModule from '@sovryn/onboard-injected';
import ledgerModule from '@sovryn/onboard-ledger';
import trezorModule from '@sovryn/onboard-trezor';
import walletConnectModule from '@sovryn/onboard-walletconnect';

import { APP_CHAIN_LIST } from '../config/chains';

const basePaths: BasePath[] = [
  { label: 'RSK Mainnet', value: "m/44'/137'/0'/0" },
  { label: 'Ethereum Mainnet', value: "m/44'/60'/0'/0" },
];
const assets: Asset[] = [{ label: 'RBTC' }, { label: 'ETH' }];

const injected = injectedModule();
const bitget = bitgetModule();
const ledger = ledgerModule({
  basePaths,
  assets,
});
const trezor = trezorModule({
  email: 'victor@sovryn.app',
  appUrl: 'https://sovryn.app',
  basePaths,
  assets,
});
const walletConnect = walletConnectModule({
  version: 2,
  projectId: 'd3483196fbaa8259ab4191347c67f973',
});

const chainList = APP_CHAIN_LIST.map(item => ({
  ...item,
  rpcUrl: typeof item.rpcUrl === 'string' ? item.rpcUrl : item.rpcUrl[0],
  indexer: undefined,
})).map(item => {
  delete item.indexer;
  delete item.isVisible;
  return item;
});

export const onboard = Onboard({
  wallets: [injected, bitget, walletConnect, ledger, trezor],
  chains: chainList,
});
