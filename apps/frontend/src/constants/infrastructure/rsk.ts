import { Environments } from '../../types/global';

const RPC_OVERRIDE_VAR = 'REACT_APP_RSK_RPC_OVERRIDE';
const rpcOverride = process.env[RPC_OVERRIDE_VAR];

const isHttpUrl = (value: string): boolean => {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

if (rpcOverride && !isHttpUrl(rpcOverride)) {
  throw new Error(
    `${RPC_OVERRIDE_VAR} must be an http(s) URL, got: ${rpcOverride}`,
  );
}

export const RSK = {
  rpc: {
    [Environments.Mainnet]: [rpcOverride || 'https://rsk-live.sovryn.app/rpc'],
    [Environments.Testnet]: ['https://testnet.sovryn.app/rpc'],
  },
  publicRpc: {
    [Environments.Mainnet]: rpcOverride || 'https://mainnet.sovryn.app/rpc',
    [Environments.Testnet]: 'https://testnet.sovryn.app/rpc',
  },
  explorer: {
    [Environments.Mainnet]: 'https://explorer.rsk.co',
    [Environments.Testnet]: 'https://explorer.testnet.rsk.co',
  },
};
