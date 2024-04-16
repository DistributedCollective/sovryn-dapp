import { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';

export const useGetVestingStakeVotingPower = (
  vestingContractAddress: string,
) => {
  const chainId = useCurrentChain();
  const stakingContract = useGetProtocolContract('staking', chainId);
  const [votingPower, setVotingPower] = useState<undefined | string>();
  const { value } = useBlockNumber();

  const getVotingPower = useCallback(async () => {
    if (!stakingContract) {
      return;
    }

    const currentDate = dayjs().unix();

    try {
      if (value && value !== 0 && currentDate) {
        const votingPower = await asyncCall(
          `staking/vestingStakes/votingPower/${vestingContractAddress}`,
          () =>
            stakingContract?.getPriorWeightedStake(
              vestingContractAddress.toLowerCase(),
              String(value - 2),
              String(currentDate),
            ),
        );

        if (votingPower) {
          setVotingPower(votingPower);
        }
      }
    } catch (e) {
      console.error(`Error while fetch vesting stakes: ${e}`);
    }
  }, [stakingContract, value, vestingContractAddress]);

  useEffect(() => {
    if (!votingPower) {
      getVotingPower();
    }
  }, [getVotingPower, votingPower]);

  return votingPower;
};
