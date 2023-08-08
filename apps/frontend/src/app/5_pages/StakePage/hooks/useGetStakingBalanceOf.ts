import { useCacheCall } from '../../../../hooks';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';

export const useGetStakingBalanceOf = (address: string) => {
  const stakingContract = useGetProtocolContract('staking');

  const { value: balance } = useCacheCall(
    `staking/${stakingContract?.address}/${address}/balanceOf`,
    async () => {
      return address && stakingContract
        ? stakingContract.balanceOf(address)
        : '0';
    },
    [address],
    '0',
  );

  return { balance };
};
