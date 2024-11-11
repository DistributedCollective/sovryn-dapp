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
    return data.proposals.filter(
      item => item.id !== '0x6496df39d000478a7a7352c01e0e713835051ccd-47',
    );
  }, [data]);

  return { loading, data: list as Proposal[] };
};
