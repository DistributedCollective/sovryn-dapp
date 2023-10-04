import { useMemo } from 'react';

import { rskClient } from '../../../../utils/clients';
import {
  VoteCast,
  useGetVoteQuery,
} from '../../../../utils/graphql/rsk/generated';

export const useGetUserVote = (proposalId: string | undefined) => {
  const { loading, data } = useGetVoteQuery({
    client: rskClient,
    variables: {
      id: proposalId,
      voter: '0x27d55f5668ef4438635bdce0adca083507e77752',
    },
  });

  const vote = useMemo(
    () => data?.voteCasts[0] as VoteCast | undefined,
    [data],
  );

  return { loading, vote };
};
