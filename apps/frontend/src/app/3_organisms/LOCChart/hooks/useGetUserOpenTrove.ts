import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { useWalletConnect } from '../../../../hooks/useWalletConnect';
import { graphZeroUrl } from '../../../../utils/constants';
import { GetUserOpenTroveDocument } from '../../../../utils/graphql/zero/generated';

const zeroClient = new ApolloClient({
  uri: graphZeroUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const useGetUserOpenTrove = () => {
  const { account } = useWalletConnect();
  const troveConfig = useMemo(
    () => ({
      user: account,
    }),
    [account],
  );

  return useQuery(GetUserOpenTroveDocument, {
    variables: troveConfig,
    client: zeroClient,
  });
};
