import { useMemo } from 'react';

import { useAccount } from '../../../../../../hooks/useAccount';
import { rskClient } from '../../../../../../utils/clients';
import { useGetVestingContractsQuery } from '../../../../../../utils/graphql/rsk/generated';
import { VestingContractTableRecord } from '../VestingStakesFrame.types';

type GetVestingContractsResponse = {
  loading: boolean;
  data?: VestingContractTableRecord[];
};

export const useGetVestingContracts = (
  page: number,
  pageSize: number,
): GetVestingContractsResponse => {
  const { account } = useAccount();

  const { data, loading } = useGetVestingContractsQuery({
    variables: {
      user: account?.toLowerCase(),
      skip: page * pageSize,
      pageSize,
    },
    client: rskClient,
  });

  const result = useMemo(
    () =>
      data?.vestingContracts.map(item => ({
        type: item.type,
        currentBalance: item.currentBalance,
        address: item.id,
        cliff: item.cliff || 0,
        createdAtTimestamp: item.createdAtTimestamp,
        duration: item.duration,
        delegate: item.delegate?.id,
      })),
    [data?.vestingContracts],
  );

  return { loading, data: result };
};
