import { AsyncContractConfigData } from '../../types';

export const bob: Record<string, AsyncContractConfigData> = {
  merkleDistributor: {
    address: '0x21a373286104acC8Fd8BFdCbe6714FEb4da30AeF',
    getAbi: async () =>
      (await import('../../abis/merkleDistributor.json')).default,
  },
  stakingRewardsOs: {
    address: '0xFdC57Cb52264209afd1559E7E3Db0F28351E9422',
    getAbi: async () =>
      (await import('../../abis/StakingRewardsOs.json')).default,
  },
  runeBridge: {
    address: '0x8989E07E565966463C73dadE4c095DaC991e1dD2',
    getAbi: async () => (await import('../../abis/RuneBridge.json')).default,
  },
};
