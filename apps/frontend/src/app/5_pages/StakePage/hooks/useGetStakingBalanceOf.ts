import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useCacheCall } from '../../../../hooks';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';

export const useGetStakingBalanceOf = (address: string) => {
  const chainId = useCurrentChain();
  const stakingContract = useGetProtocolContract('staking', chainId);

  const { value: balance } = useCacheCall(
    `staking/${stakingContract?.address}/${address}/balanceOf`,
    RSK_CHAIN_ID,
    async () =>
      address && stakingContract ? stakingContract.balanceOf(address) : '0',
    [address],
    '0',
  );

  return { balance };
};
