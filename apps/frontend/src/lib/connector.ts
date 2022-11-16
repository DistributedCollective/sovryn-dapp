import Onboard from '@sovryn/onboard-core';
import injectedModule from '@sovryn/onboard-injected';
import walletConnectModule from '@sovryn/onboard-walletconnect';

import { chains } from '../config/chains';

const injected = injectedModule();
const walletConnect = walletConnectModule();
export const onboard = Onboard({
  wallets: [injected, walletConnect],
  chains: chains.map(item => ({
    ...item,
    rpcUrl: typeof item.rpcUrl === 'string' ? item.rpcUrl : item.rpcUrl[0],
  })),
});
