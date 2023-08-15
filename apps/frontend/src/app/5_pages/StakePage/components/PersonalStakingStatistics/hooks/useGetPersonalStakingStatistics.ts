import { useCacheCall } from '../../../../../../hooks';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { useGetStakingBalanceOf } from '../../../hooks/useGetStakingBalanceOf';

export const useGetPersonalStakingStatistics = () => {
  const { account } = useAccount();
  const stakingContract = useGetProtocolContract('staking');

  const { balance } = useGetStakingBalanceOf(account);

  const { value: votingPower } = useCacheCall(
    `staking/${stakingContract?.address}/${account}/votingPower`,
    async () =>
      account && stakingContract
        ? stakingContract.getCurrentVotes(account)
        : '0',
    [account],
    '0',
  );

  return { balance, votingPower };
};
