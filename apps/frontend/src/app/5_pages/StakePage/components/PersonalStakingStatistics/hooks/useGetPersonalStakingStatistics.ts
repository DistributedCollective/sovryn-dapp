import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import { useCacheCall } from '../../../../../../hooks';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { useGetStakingBalanceOf } from '../../../hooks/useGetStakingBalanceOf';

export const useGetPersonalStakingStatistics = () => {
  const { account } = useAccount();
  const chainId = useCurrentChain();
  const stakingContract = useGetProtocolContract('staking', chainId);

  const { balance } = useGetStakingBalanceOf(account);

  const { value: votingPower } = useCacheCall(
    `staking/${stakingContract?.address}/${account}/votingPower`,
    RSK_CHAIN_ID,
    async () =>
      account && stakingContract
        ? stakingContract.getCurrentVotes(account)
        : '0',
    [account],
    '0',
  );

  return { balance, votingPower };
};
