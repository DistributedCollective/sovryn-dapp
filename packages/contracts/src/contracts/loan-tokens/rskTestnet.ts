import { AsyncContractConfigData } from '../../types';

export const rskTestnet: Record<string, AsyncContractConfigData> = {
  dllr: {
    address: '0x9125087A98BC975Fa3E912226165D5C7e9F669cc',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicStandard.json')).default,
  },
  doc: {
    address: '0x74e00A8CeDdC752074aad367785bFae7034ed89f',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicStandard.json')).default,
  },
  bpro: {
    address: '0x6226b4B3F29Ecb5f9EEC3eC3391488173418dD5d',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicStandard.json')).default,
  },
  xusd: {
    address: '0xE27428101550f8104A6d06D830e2E0a097e1d006',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicStandard.json')).default,
  },
  rbtc: {
    address: '0xe67Fe227e0504e8e96A34C3594795756dC26e14B',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicWRBTC.json')).default,
  },
  rusdt: {
    address: '0xd1f225BEAE98ccc51c468d1E92d0331c4f93e566',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicStandard.json')).default,
  },
  mynt: {
    address: '0x139483e22575826183F5b56dd242f8f2C1AEf327',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicStandard.json')).default,
  },
};
