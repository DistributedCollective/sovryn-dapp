import { useEffect, useMemo, useState } from 'react';

import { Contract } from 'ethers';

import { getProtocolContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { TOKEN_RENDER_PRECISION } from '../../../../../../constants/currencies';
import { useAccount } from '../../../../../../hooks/useAccount';
import { VestingContractType } from '../../../../../../utils/graphql/rsk/generated';
import { fromWeiFixed } from '../../../../../../utils/math';
import FourYearVestingAbi from '../FourYearVesting.json';
import VestingAbi from '../Vesting.json';

const TWO_WEEKS = 1209600;
export const ethGenesisAddress = '0x0000000000000000000000000000000000000000';

export const useGetUnlockedVesting = (
  cliff: number,
  contractAddress: string,
  type: VestingContractType,
) => {
  const { signer } = useAccount();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string | undefined>(undefined);

  const isFourYearVesting = useMemo(
    () => type === VestingContractType.FourYearVesting,
    [type],
  );

  useEffect(() => {
    const calculate = async () => {
      if (!signer) {
        return '0';
      }

      let value: Decimal = Decimal.ZERO;
      let end;

      try {
        const { address: stakingContractAddress, abi: stakingAbi } =
          await getProtocolContract('staking');

        const vestingContract = new Contract(
          contractAddress.toLowerCase(),
          VestingAbi,
          signer,
        );
        const fourYearVestingContract = new Contract(
          contractAddress.toLowerCase(),
          FourYearVestingAbi,
          signer,
        );
        const stakingContract = new Contract(
          stakingContractAddress.toLowerCase(),
          stakingAbi,
          signer,
        );

        if (!vestingContract || !stakingContract || !fourYearVestingContract) {
          return '0';
        }

        const startDate = await vestingContract.startDate();
        const allUnlocked = await stakingContract.allUnlocked();

        // In the unlikely case that all tokens have been unlocked early, allow to withdraw all of them.
        if (allUnlocked) {
          end = Number(await vestingContract.endDate());
        } else {
          end = Math.round(new Date().getTime() / 1e3);
        }

        const blockNumber = await getProvider(defaultChainId).getBlockNumber();

        for (let i = Number(startDate) + cliff; i <= end; i += TWO_WEEKS) {
          const stake = await stakingContract.getPriorUserStakeByDate(
            contractAddress.toLowerCase(),
            i,
            blockNumber - 1,
          );

          value = value.add(Decimal.from(Number(stake)));
        }

        if (isFourYearVesting) {
          const extendedDuration =
            (await fourYearVestingContract.extendDurationFor()) || 0;

          if (
            Math.round(Date.now() / 1e3) <=
            Number(startDate) + Number(extendedDuration)
          ) {
            value = Decimal.ZERO;
          }
        }
      } catch (error) {
        setAmount('0');
        setLoading(false);
      }

      return fromWeiFixed(value.toString(), TOKEN_RENDER_PRECISION);
    };

    if (contractAddress && contractAddress !== ethGenesisAddress && !amount) {
      setLoading(true);
      calculate()
        .then(setAmount)
        .catch(error => {
          console.error(error);
          setAmount('0');
        })
        .finally(() => setLoading(false));
    }
  }, [amount, cliff, contractAddress, isFourYearVesting, signer]);

  return { value: amount, loading };
};
