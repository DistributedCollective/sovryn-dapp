import { useEffect, useState } from 'react';

import { Contract } from 'ethers';

import { getProtocolContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import { asyncCall } from '../../../../../../store/rxjs/provider-cache';
import { getRskChainId } from '../../../../../../utils/chain';

export const useGetVestingStakeStartEndDates = (
  vestingContractAddress: string,
) => {
  const [startDate, setStartDate] = useState('0');
  const [endDate, setEndDate] = useState('0');

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const [start, end] = await asyncCall(
          `vesting/dates/${vestingContractAddress}`,
          async () => {
            const { abi } = await getProtocolContract(
              'vesting',
              getRskChainId(),
            );
            const provider = getProvider(getRskChainId());
            const contract = new Contract(
              vestingContractAddress,
              abi,
              provider,
            );
            return await Promise.all([
              contract.startDate(),
              contract.endDate(),
            ]);
          },
        );
        setStartDate(start.toString());
        setEndDate(end.toString());
      } catch (error) {
        console.error('Error fetching vesting stake unlock dates:', error);
      }
    };

    fetchDates();
  }, [vestingContractAddress]);

  return { startDate, endDate };
};
