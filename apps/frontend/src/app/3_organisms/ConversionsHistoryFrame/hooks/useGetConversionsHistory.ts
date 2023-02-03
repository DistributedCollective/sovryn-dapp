import { useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { useAccount } from '../../../../hooks/useAccount';
import { myntClient } from '../../../../utils/clients';
import { GetUserConversionsDocument } from '../../../../utils/graphql/mynt/generated';

export const useGetConversionsHistory = (pageSize: number, page: number) => {
  const { account } = useAccount();

  const config = useMemo(
    () => ({
      user: account,
      skip: page * pageSize,
      pageSize,
    }),
    [account, page, pageSize],
  );

  return useQuery(GetUserConversionsDocument, {
    variables: config,
    client: myntClient,
  });
};
