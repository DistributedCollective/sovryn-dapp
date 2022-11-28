import { providers, TypedDataDomain, TypedDataField } from 'ethers';

import { EIP1193Provider } from '@sovryn/onboard-common';

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
