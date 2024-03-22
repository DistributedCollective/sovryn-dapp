import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useCacheCall } from '../../../../hooks';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';

export const useGetStakingBalanceOf = (address: string) => {
  const stakingContract = useGetProtocolContract('staking', RSK_CHAIN_ID);

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
