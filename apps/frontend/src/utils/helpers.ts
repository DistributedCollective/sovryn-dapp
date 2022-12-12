import dayjs from 'dayjs';
import { providers, TypedDataDomain, TypedDataField } from 'ethers';

import { EIP1193Provider } from '@sovryn/onboard-common';

import { servicesConfig } from './constants';

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

export const isMainnet = () => process.env.REACT_APP_NETWORK === 'mainnet';

export const getServicesConfig = () =>
  servicesConfig[isMainnet() ? 'mainnet' : 'testnet'];

export function dateFormat(timestamp: number) {
  const stamp = dayjs.tz(Number(timestamp) * 1e3, 'UTC');
  return stamp.format(`YYYY-MM-DD-HH:MM:ss`);
}

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