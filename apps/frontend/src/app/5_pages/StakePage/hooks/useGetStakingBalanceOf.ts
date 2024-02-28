import { defaultRskChainId } from '../../../../config/chains';

import { useCacheCall } from '../../../../hooks';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';

export const useGetStakingBalanceOf = (address: string) => {
  const stakingContract = useGetProtocolContract('staking', defaultRskChainId);

  const { value: balance } = useCacheCall(
    `staking/${stakingContract?.address}/${address}/balanceOf`,
    defaultRskChainId,
    async () =>
      address && stakingContract ? stakingContract.balanceOf(address) : '0',
    [address],
    '0',
  );

  return { balance };
};
