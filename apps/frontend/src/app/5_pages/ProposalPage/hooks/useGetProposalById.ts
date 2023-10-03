import { useMemo } from 'react';

import { rskClient } from '../../../../utils/clients';
import {
  Proposal,
  useGetProposalQuery,
} from '../../../../utils/graphql/rsk/generated';

export const useGetProposalById = (id: string) => {
  const { loading, data } = useGetProposalQuery({
    client: rskClient,
    variables: {
      id,
    },
  });

  const proposal = useMemo(
    () => data?.proposal as Proposal | undefined,
    [data],
  );

  return { loading, proposal };
};
