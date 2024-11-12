import { useMemo } from 'react';

import { rskClient } from '../../../../utils/clients';
import {
  Proposal,
  useGetProposalsQuery,
} from '../../../../utils/graphql/rsk/generated';

export const useGetProposals = () => {
  const { loading, data } = useGetProposalsQuery({
    client: rskClient,
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.proposals;
  }, [data]);

  return { loading, data: list as Proposal[] };
};
