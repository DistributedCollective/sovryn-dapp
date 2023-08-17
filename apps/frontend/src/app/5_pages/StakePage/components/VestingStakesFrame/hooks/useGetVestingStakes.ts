import { useCallback, useEffect, useState } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import {
  Vesting,
  VestingData,
  VestingGroup,
} from '../VestingStakesFrame.types';
import { useGetVestings } from './useGetVestings';

const getLabel = (type: string, typeCreation: string): VestingGroup => {
  return {
    '0 1': 'team',
    '0 5': 'teamFouryear',
    '1 1': 'genesis',
    '1 2': 'origin',
    '1 3': 'reward',
    '1 4': 'fouryear',
    // 'fish vestingRegistryFish': 'fish',
    // 'fishAirdrop vestingRegistryFish': 'fishAirdrop',
  }[`${type} ${typeCreation}`];
};

export const useGetVestingStakes = () => {
  const { account } = useAccount();
  const { vestingContracts, loadingVestings } = useGetVestings();
  // const { vestingFishContract, loadingVestingsFish } = useGetVestingsFish(); TODO: Fish vesting contracts will be supported in a later release
  const [vestingStakes, setVestingStakes] = useState<Vesting[]>([]);

  const prepareVestingData = useCallback(
    (vestingContracts: VestingData[], vestingFishContract?: string) => {
      const addresses: string[] = [];
      const types: string[] = [];
      const typeCreations: string[] = [];

      vestingContracts.forEach(
        ({ vestingAddress, vestingType, vestingCreationType }) => {
          addresses.push(vestingAddress);
          types.push(vestingType);
          typeCreations.push(vestingCreationType.toString());
        },
      );

      // if (
      //   vestingFishContract.length &&
      //   constants.AddressZero !== vestingFishContract
      // ) {
      //   addresses.push(vestingFishContract);
      //   types.push('fish');
      //   typeCreations.push('vestingRegistryFish');
      // }

      return { addresses, types, typeCreations };
    },
    [],
  );

  const fetchVestingData = useCallback(
    async (
      address: string,
      index: number,
      types: string[],
      typeCreations: string[],
    ) => {
      const type = types[index];
      const typeCreation = typeCreations[index];

      const label = getLabel(type, typeCreation);

      const registryType =
        typeCreation === 'vestingRegistryFish' ? 'stakingFish' : 'staking';

      return {
        staking: registryType,
        type: label,
        typeCreation,
        vestingContract: address,
      };
    },
    [],
  );

  const getVestings = useCallback(async () => {
    try {
      const { addresses, types, typeCreations } = prepareVestingData(
        vestingContracts,
        //vestingFishContract,
      );

      const vestingStakes = await Promise.all(
        addresses.map((address, index) =>
          fetchVestingData(address, index, types, typeCreations),
        ),
      );

      setVestingStakes(vestingStakes);
    } catch (error) {
      console.error('Error fetching vesting stakes:', error);
    }
  }, [prepareVestingData, fetchVestingData, vestingContracts]);

  useEffect(() => {
    if (account && !loadingVestings) {
      getVestings();
    } else if (!account) {
      setVestingStakes([]);
    }
  }, [account, loadingVestings, getVestings]);

  return { vestingStakes, loadingVestings };
};
