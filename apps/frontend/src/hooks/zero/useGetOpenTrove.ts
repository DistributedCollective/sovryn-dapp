import { ApolloClient, InMemoryCache } from '@apollo/client';

import { useMemo } from 'react';

import { graphZeroUrl } from '../../utils/constants';
import {
  TroveStatus,
  useGetUserOpenTroveQuery,
} from '../../utils/graphql/zero/generated';
import { useWalletConnect } from '../useWalletConnect';

const zeroClient = new ApolloClient({
  uri: graphZeroUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const useGetOpenTrove = () => {
  const { account } = useWalletConnect();
  const { loading, data } = useGetUserOpenTroveQuery({
    variables: { user: account },
    client: zeroClient,
  });

  const isTroveOpenExists = useMemo(
    () => !loading && data?.trove?.status === TroveStatus.Open,
    [loading, data],
  );

  return isTroveOpenExists;
};
