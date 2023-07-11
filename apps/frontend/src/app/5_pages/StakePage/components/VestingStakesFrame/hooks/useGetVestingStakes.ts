import { useCallback, useEffect, useState } from 'react';

import { constants } from 'ethers';

import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { getRskChainId } from '../../../../../../utils/chain';
import { Vesting, VestingData } from '../VestingStakesFrame.types';

export const useGetVestingStakes = () => {
  const { account } = useAccount();
  const vestingContract = useGetProtocolContract(
    'vestingRegistry',
    getRskChainId(),
  );
  const vestingFishContract = useGetProtocolContract(
    'vestingRegistryFish',
    getRskChainId(),
  );
  const [vestingContracts, setVestingContracts] = useState<VestingData[]>([]);
  const [vestingFishStakes, setVestingFishStakes] = useState<VestingData[]>([]);
  const [vestingTeamStakes, setVestingTeamStakes] = useState<VestingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [vestingStakes, setVestingStakes] = useState<Vesting[]>([]);

  const updateVestingContracts = useCallback(async () => {
    if (!vestingContract || isDataFetched) {
      return;
    }

    setLoading(true);
    try {
      const getVestingContracts = await vestingContract.getVestingsOf(account);

      if (getVestingContracts) {
        setVestingContracts(getVestingContracts);
      }
    } catch (error) {
      console.error('Error fetching vesting contracts:', error);
    } finally {
      setLoading(false);
      setIsDataFetched(true);
    }
  }, [vestingContract, account, isDataFetched]);

  const updateVestingFishStakes = useCallback(async () => {
    if (!vestingFishContract || isDataFetched) {
      return;
    }

    setLoading(true);
    try {
      const getVestingFishStakes = await vestingFishContract.getVesting(
        account,
      );
      if (getVestingFishStakes) {
        setVestingFishStakes(getVestingFishStakes);
      }
    } catch (error) {
      console.error('Error fetching fish vesting stakes:', error);
    } finally {
      setLoading(false);
      setIsDataFetched(true);
    }
  }, [vestingFishContract, account, isDataFetched]);

  const updateVestingTeamStakes = useCallback(async () => {
    if (!vestingFishContract || isDataFetched) {
      return;
    }

    setLoading(true);
    try {
      const getVestingTeamStakes = await vestingFishContract.getTeamVesting(
        account,
      );

      if (getVestingTeamStakes) {
        setVestingTeamStakes(getVestingTeamStakes);
      }
    } catch (error) {
      console.error('Error fetching vesting team stakes:', error);
    } finally {
      setLoading(false);
      setIsDataFetched(true);
    }
  }, [vestingFishContract, account, isDataFetched]);

  useEffect(() => {
    const getVestings = async () => {
      try {
        setLoading(true);
        const addresses: string[] = [];
        const types: string[] = [];
        const typeCreations: string[] = [];

        const vestingContractAddresses = vestingContracts.map(
          ({ vestingAddress }) => vestingAddress,
        );
        const vestingContractTypes = vestingContracts.map(
          ({ vestingType }) => vestingType,
        );
        const vestingContractTypeCreations = vestingContracts.map(
          ({ vestingCreationType }) => vestingCreationType,
        );

        addresses.push(...vestingContractAddresses);
        types.push(...vestingContractTypes);
        typeCreations.push(...vestingContractTypeCreations);

        if (
          vestingFishStakes.length &&
          constants.AddressZero !== vestingFishStakes[0].vestingAddress &&
          vestingFishStakes[0].vestingAddress
        ) {
          addresses.push(vestingFishStakes[0].vestingAddress);
          types.push('fish');
          typeCreations.push('vestingRegistryFish');
        }

        if (
          vestingTeamStakes.length &&
          constants.AddressZero !== vestingTeamStakes[0].vestingAddress &&
          vestingTeamStakes[0].vestingAddress
        ) {
          addresses.push(vestingTeamStakes[0].vestingAddress);
          types.push('fishAirdrop');
          typeCreations.push('vestingRegistryFish');
        }

        const vestingStakes = await Promise.all(
          addresses.map(async (address, index): Promise<Vesting> => {
            const type = types[index];
            const typeCreation = typeCreations[index].toString();

            const label = {
              '0 1': 'team',
              '1 1': 'genesis',
              '1 2': 'origin',
              '1 3': 'reward',
              '1 4': 'fourYear',
              'fish vestingRegistryFish': 'fish',
              'fishAirdrop vestingRegistryFish': 'fishAirdrop',
            }[`${type} ${typeCreation}`];

            const registryType =
              typeCreation === 'vestingRegistryFish'
                ? 'stakingFish'
                : 'staking';

            return {
              staking: registryType,
              type: label,
              typeCreation,
              vestingContract: address,
            };
          }),
        );

        setVestingStakes(vestingStakes);
      } catch (error) {
        console.error('Error fetching vesting stakes:', error);
      } finally {
        setLoading(false);
      }
    };

    getVestings();
  }, [vestingContracts, vestingFishStakes, vestingTeamStakes]);

  useEffect(() => {
    if (account) {
      updateVestingContracts();
      updateVestingFishStakes();
      updateVestingTeamStakes();
    }
  }, [
    account,
    updateVestingContracts,
    updateVestingFishStakes,
    updateVestingTeamStakes,
  ]);

  return { vestingStakes, loading };
};
