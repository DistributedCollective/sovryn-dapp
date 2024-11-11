import { useMemo } from 'react';

import { rskClient } from '../../../../utils/clients';
import {
  Proposal,
  useGetProposalQuery,
} from '../../../../utils/graphql/rsk/generated';

export const useGetProposalById = (id: string) => {
  const { loading, data, refetch } = useGetProposalQuery({
    client: rskClient,
    variables: {
      id,
    },
  });

  const proposal = useMemo(() => {
    const item = data?.proposal as Proposal | undefined;
    return item && item.id !== '0x6496df39d000478a7a7352c01e0e713835051ccd-47'
      ? item
      : undefined;
  }, [data]);

  return { loading, proposal, refetch };
};
