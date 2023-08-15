import { useMemo } from 'react';

import { rskClient } from '../../../../../../utils/clients';
import { useGetLastVestingWithdrawQuery } from '../../../../../../utils/graphql/rsk/generated';

export const useGetLastTokensWithdraw = (address: string) => {
  const { data, loading, refetch } = useGetLastVestingWithdrawQuery({
    variables: { vestingAddress: address },
    client: rskClient,
  });

  const lastWithdrawTimestamp = useMemo(
    () => data?.vestingContracts?.[0].stakeHistory?.[0]?.timestamp || undefined,
    [data?.vestingContracts],
  );

  return { lastWithdrawTimestamp, loading, refetch };
};
