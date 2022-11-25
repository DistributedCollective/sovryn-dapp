import { MESSAGE_TYPES } from './constants';

export const prettyTx = (
  text: string,
  startLength: number = 6,
  endLength: number = 4,
) => {
  const start = text.substr(0, startLength);
  const end = text.substr(-endLength);
  return `${start} ··· ${end}`;
};

export const getExampleMessageToSign = (chainId: number) => ({
  domain: {
    chainId,
    name: 'Ether Mail',
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    version: '1',
  },

  exampleMessage: {
    content: 'an example message',
  },

  types: {
    exampleMessage: MESSAGE_TYPES.exampleMessage,
  },
});
