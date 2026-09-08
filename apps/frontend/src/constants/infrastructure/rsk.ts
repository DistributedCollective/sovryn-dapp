import { Environments } from '../../types/global';

const RPC_OVERRIDE_VAR = 'REACT_APP_RSK_RPC_OVERRIDE';
const requestedOverride = process.env[RPC_OVERRIDE_VAR];

/**
 * A development build only.
 *
 * CRA inlines every REACT_APP_* value at build time, so a release built in a
 * shell that happened to export this — a leftover export, a CI variable, `yarn
 * qa` run in the wrong window — would ship a bundle labelled mainnet whose
 * balances, rates and vault rows come from a QA fork while the wallet signs
 * against real mainnet. The URL-shape check below cannot catch that; the build
 * mode can, and it is the only guard that is not a matter of remembering.
 */
const isOverrideAllowed = process.env.NODE_ENV === 'development';

const isHttpUrl = (value: string): boolean => {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

if (isOverrideAllowed && requestedOverride && !isHttpUrl(requestedOverride)) {
  throw new Error(
    `${RPC_OVERRIDE_VAR} must be an http(s) URL, got: ${requestedOverride}`,
  );
}

/**
 * The RPC every mainnet read is redirected to, or undefined when none is in
 * force. Exported so the app can say on screen that it is not talking to
 * mainnet — an override that is invisible is one nobody notices they shipped.
 */
export const RSK_RPC_OVERRIDE = isOverrideAllowed
  ? requestedOverride
  : undefined;

export const RSK = {
  rpc: {
    [Environments.Mainnet]: [
      RSK_RPC_OVERRIDE || 'https://rsk-live.sovryn.app/rpc',
    ],
    [Environments.Testnet]: ['https://testnet.sovryn.app/rpc'],
  },
  publicRpc: {
    [Environments.Mainnet]:
      RSK_RPC_OVERRIDE || 'https://mainnet.sovryn.app/rpc',
    [Environments.Testnet]: 'https://testnet.sovryn.app/rpc',
  },
  explorer: {
    [Environments.Mainnet]: 'https://explorer.rsk.co',
    [Environments.Testnet]: 'https://explorer.testnet.rsk.co',
  },
};
