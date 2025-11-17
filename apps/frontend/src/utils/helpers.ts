import { RefObject } from 'react';

import { Network } from 'bitcoin-address-validation';
import dayjs from 'dayjs';
import { BigNumber, providers } from 'ethers';
import resolveConfig from 'tailwindcss/resolveConfig';

import { EIP1193Provider } from '@sovryn/onboard-common';
import tailwindConfig from '@sovryn/tailwindcss-config';
import { Decimalish } from '@sovryn/utils';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../config/chains';

import { MS } from '../constants/general';
import {
  AMM_SERVICE,
  GRAPH_WRAPPER,
  INDEXER_SERVICE,
  ORIGINS_URL,
  SERVICES_CONFIG,
} from '../constants/infrastructure';
import { BOB } from '../constants/infrastructure/bob';
import { BTC } from '../constants/infrastructure/btc';
import { RSK } from '../constants/infrastructure/rsk';
import { ALPHA_LINKS, BITOCRACY_LINKS, GITHUB_LINKS } from '../constants/links';
import { Environments } from '../types/global';
import { COMMON_SYMBOLS, findAsset } from './asset';
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

export const currentNetwork: Environments = !!process.env.REACT_APP_NETWORK
  ? (process.env.REACT_APP_NETWORK as Environments)
  : Environments.Mainnet;

export const currentBtcNetwork: Network =
  currentNetwork === Environments.Mainnet ? Network.mainnet : Network.testnet;

export const isMainnet = () =>
  process.env.REACT_APP_NETWORK === Environments.Mainnet;

export const isDevEnvironment = () => process.env.NODE_ENV === 'development';

export const isTestnetFastBtcEnabled = () =>
  process.env.REACT_APP_ENABLE_TESTNET_FAST_BTC === 'true';

export const isIPFSBuild = () => process.env.REACT_APP_IPFS_BUILD === 'true';

export const getServicesConfig = () =>
  SERVICES_CONFIG[isMainnet() ? Environments.Mainnet : Environments.Testnet];

export const getRskExplorerUrl = () =>
  RSK.explorer[isMainnet() ? 'mainnet' : 'testnet'];

export const getBobExplorerUrl = () =>
  BOB.explorer[isMainnet() ? 'mainnet' : 'testnet'];

export const getBtcExplorerUrl = () =>
  BTC.explorer[isMainnet() ? 'mainnet' : 'testnet'];

export const getD1Url = () =>
  isStaging()
    ? ALPHA_LINKS.STAGING
    : ALPHA_LINKS[isMainnet() ? Environments.Mainnet : Environments.Testnet];

export const generateD1Link = (path: string) => {
  const URI = getD1Url();
  return `${URI}${path}`;
};

export const getBitocracyUrl = () =>
  BITOCRACY_LINKS[isMainnet() ? Environments.Mainnet : Environments.Testnet];

export const getGraphWrapperUrl = () =>
  GRAPH_WRAPPER[isMainnet() ? Environments.Mainnet : Environments.Testnet];

/** @deprecated */
export const getIndexerUrl = () =>
  INDEXER_SERVICE[isMainnet() ? Environments.Mainnet : Environments.Testnet];

export const getAmmServiceUrl = () =>
  AMM_SERVICE[isMainnet() ? Environments.Mainnet : Environments.Testnet];

export const getOriginsUrl = () =>
  ORIGINS_URL[isMainnet() ? Environments.Mainnet : Environments.Testnet];

export const dateFormat = (timestamp: number) => {
  const stamp = dayjs.tz(Number(timestamp) * MS, 'UTC');
  return stamp.format(`YYYY-MM-DD HH:mm:ss +UTC`);
};

export const getNextDay = (day: number) => {
  if (day < 1 || day > 7) {
    throw new Error('Invalid day, must be integer in range 1-7');
  }

  return dayjs().utc().startOf('week').add(1, 'week').day(day).format('MMMM D');
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

export const validateURL = (link: string) => {
  const protocolRelativeUrl =
    // eslint-disable-next-line no-useless-escape
    /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  const url =
    // eslint-disable-next-line no-useless-escape
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

  return protocolRelativeUrl.test(link) || url.test(link);
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

export const validateJwt = (token: string) => {
  const parsedToken = parseJwt(token);
  const now = Date.now() / 1000;
  return parsedToken?.exp > now;
};

export const composeGas = (priceInGwei: Decimalish, limitInWei: Decimalish) =>
  decimalic(priceInGwei)
    .mul(10 ** 9)
    .mul(limitInWei)
    .div(10 ** 18);

export const isMobileDevice = () => {
  const config = resolveConfig(tailwindConfig as any);
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

export const calculateCollateralRatio = (
  collateral: Decimalish,
  debt: Decimalish,
  price: Decimalish,
) => decimalic(collateral).mul(price).div(debt).mul(100);

export const removeTrailingZerosFromString = (value: string) =>
  value.includes('.') ? value.replace(/\.?0+$/, '') : value;

export const isBtcBasedAsset = (asset: string) =>
  [COMMON_SYMBOLS.BTC, COMMON_SYMBOLS.WBTC, 'RBTC', 'WRBTC'].includes(
    asset.toUpperCase(),
  );

export const isBitpro = (asset: string) =>
  [COMMON_SYMBOLS.BPRO, 'BITPRO', 'BITP'].includes(asset.toUpperCase());

export const areValuesIdentical = (
  firstValue: Decimal,
  secondValue: Decimal,
) => {
  const epsilon = 0.0000000000001;

  return Math.abs(firstValue.sub(secondValue).toNumber()) < epsilon;
};

export const renderTokenSymbol = (token: string) =>
  findAsset(token, RSK_CHAIN_ID).symbol;

export const generateNonce = () =>
  BigNumber.from(Math.floor(Date.now() + Math.random() * 100));

export const scrollToElement = (ref: RefObject<any>) => {
  if (ref.current) {
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

export function sanitizeUsd(v: unknown, cap = 1e9): number {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > cap) return 0;
  return n;
}

export function safeAddUsd(a: unknown, b: unknown, cap = 1e9): string {
  return String(sanitizeUsd(a, cap) + sanitizeUsd(b, cap));
}
