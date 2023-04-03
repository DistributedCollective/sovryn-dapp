import dayjs from 'dayjs';
import { providers, TypedDataDomain, TypedDataField } from 'ethers';
import resolveConfig from 'tailwindcss/resolveConfig';

import { EIP1193Provider } from '@sovryn/onboard-common';
import tailwindConfig from '@sovryn/tailwindcss-config';
import { Decimalish } from '@sovryn/utils';

import {
  BTC_EXPLORER,
  RSK_EXPLORER,
  SERVICES_CONFIG,
} from '../constants/infrastructure';
import { GITHUB_LINKS } from '../constants/links';
import { Environments } from '../types/global';
import { decimalic } from './math';

export const prettyTx = (
  text: string,
  startLength: number = 6,
  endLength: number = 4,
) => {
  const start = text.substr(0, startLength);
  const end = text.substr(-endLength);
  return `${start} ··· ${end}`;
};

export const signTypedData = async (
  provider: EIP1193Provider,
  domain: TypedDataDomain,
  types: Record<string, Array<TypedDataField>>,
  data: Record<string, any>,
) => {
  // A Signer MUST always make sure, that if present, the "from" field
  //  matches the Signer, before sending or signing a transaction
  // A Signer SHOULD always wrap private information (such as a private
  //  key or mnemonic) in a function, so that console.log does not leak
  //  the data
  const signer = new providers.Web3Provider(provider);
  const signature = await signer
    .getSigner()
    ._signTypedData(domain, types, data);
  return signature;
};

export const currentNetwork: Environments = !!process.env.REACT_APP_NETWORK
  ? (process.env.REACT_APP_NETWORK as Environments)
  : Environments.Mainnet;

export const isMainnet = () =>
  process.env.REACT_APP_NETWORK === Environments.Mainnet;

export const isTestnetFastBtcEnabled = () =>
  process.env.REACT_APP_ENABLE_TESTNET_FAST_BTC === 'true';

export const getServicesConfig = () =>
  SERVICES_CONFIG[isMainnet() ? Environments.Mainnet : Environments.Testnet];

export const getRskExplorerUrl = () =>
  RSK_EXPLORER[isMainnet() ? 'mainnet' : 'testnet'];

export const getBtcExplorerUrl = () =>
  BTC_EXPLORER[isMainnet() ? 'mainnet' : 'testnet'];

export const dateFormat = (timestamp: number) => {
  const stamp = dayjs.tz(Number(timestamp) * 1e3, 'UTC');
  return stamp.format(`YYYY-MM-DD HH:MM:ss +UTC`);
};

export const signMessage = async (
  provider: EIP1193Provider,
  message: string,
) => {
  const signer = new providers.Web3Provider(provider);
  const signature = await signer.getSigner().signMessage(message);

  return signature;
};

export const validateEmail = (email: string) => {
  // eslint-disable-next-line no-useless-escape
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const parseJwt = (token: string) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload);
};

export const valueIsDefined = <T>(
  entry: [string, T | undefined],
): entry is [string, T] => entry[1] !== undefined;

export const composeGas = (priceInGwei: Decimalish, limitInWei: Decimalish) =>
  decimalic(priceInGwei)
    .mul(10 ** 9)
    .mul(limitInWei)
    .div(10 ** 18);

export const isMobileDevice = () => {
  const config = resolveConfig(tailwindConfig);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const widthToCheck: string = config?.theme?.screens.md; // value will be in format "768px"
  const screenWidth = window?.visualViewport?.width || 0;
  return screenWidth < parseInt(widthToCheck || '0');
};

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const isStaging = () => process.env.REACT_APP_STAGING === 'true';

export const areAddressesEqual = (address1: string, address2: string) =>
  address1.toLowerCase() === address2.toLowerCase();

export const getChangelogUrl = (commit: string) =>
  `${GITHUB_LINKS.DAPP}/blob/${encodeURI(commit)}/apps/frontend/CHANGELOG.md`;
