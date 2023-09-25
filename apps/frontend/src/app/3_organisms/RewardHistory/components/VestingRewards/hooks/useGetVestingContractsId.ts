import { useMemo } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { rskClient } from '../../../../../../utils/clients';
import { useGetVestingContractsIdQuery } from '../../../../../../utils/graphql/rsk/generated';

type GetVestingContractsResponse = {
  loading: boolean;
  data?: string[];
};

export const useGetVestingContractsId = (): GetVestingContractsResponse => {
  const { account } = useAccount();

  const { data, loading } = useGetVestingContractsIdQuery({
    variables: {
      user: account?.toLowerCase(),
    },
    client: rskClient,
  });

  const result = useMemo(
    () => data?.vestingContracts.map(item => item.id),
    [data?.vestingContracts],
  );

  return { loading, data: result };
};
