import { useMemo } from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { rskClient } from '../../../../utils/clients';
import {
  VoteCast,
  useGetVoteQuery,
} from '../../../../utils/graphql/rsk/generated';

export const useGetUserVote = (proposalId: string | undefined) => {
  const { account } = useAccount();
  const { loading, data } = useGetVoteQuery({
    client: rskClient,
    variables: {
      id: proposalId,
      voter: account.toLowerCase(),
    },
  });

  const vote = useMemo(
    () => data?.voteCasts[0] as VoteCast | undefined,
    [data],
  );

  return { loading, vote };
};
