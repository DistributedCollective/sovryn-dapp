import { useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { myntClient } from '../../../../utils/clients';
import { GetUserConversionsDocument } from '../../../../utils/graphql/mynt/generated';

export const useGetConversionsHistory = () => {
  const { account } = useAccount();

  const config = useMemo(
    () => ({
      user: account,
    }),
    [account],
  );

  return useQuery(GetUserConversionsDocument, {
    variables: config,
    client: myntClient,
  });
};
