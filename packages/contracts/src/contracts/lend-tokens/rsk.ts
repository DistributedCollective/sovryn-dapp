import { AsyncContractConfigData } from '../../types';

export const rsk: Record<string, AsyncContractConfigData> = {
  dllr: {
    address: '0x077FCB01cAb070a30bC14b44559C96F529eE017F',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicStandard.json')).default,
  },
  doc: {
    address: '0xd8D25f03EBbA94E15Df2eD4d6D38276B595593c1',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicStandard.json')).default,
  },
  bpro: {
    address: '0x6E2fb26a60dA535732F8149b25018C9c0823a715',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicStandard.json')).default,
  },
  xusd: {
    address: '0x8F77ecf69711a4b346f23109c40416BE3dC7f129',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicStandard.json')).default,
  },
  rbtc: {
    address: '0xa9DcDC63eaBb8a2b6f39D7fF9429d88340044a7A',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicWRBTC.json')).default,
  },
  rusdt: {
    address: '0x849C47f9C259E9D62F289BF1b2729039698D8387',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicStandard.json')).default,
  },
};
