import { rskClient } from '../../../../../../utils/clients';
import { useGetLastVestingWithdrawQuery } from '../../../../../../utils/graphql/rsk/generated';

export const useGetLastTokensWithdraw = (address: string) => {
  const lastTokensWithdraw = useGetLastVestingWithdrawQuery({
    variables: { vestingAddress: address },
    client: rskClient,
  });

  return (
    lastTokensWithdraw.data?.vestingContracts?.[0].stakeHistory?.[0]
      ?.timestamp || undefined
  );
};
