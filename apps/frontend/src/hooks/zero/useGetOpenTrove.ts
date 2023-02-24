import { ApolloClient, InMemoryCache } from '@apollo/client';

import { useEffect, useMemo, useState } from 'react';

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
  const [isTroveOpenExists, setIsTroveOpenExists] = useState(false);
  const troveConfig = useMemo(
    () => ({
      user: account,
    }),
    [account],
  );

  const { loading, data } = useGetUserOpenTroveQuery({
    variables: troveConfig,
    client: zeroClient,
  });

  useEffect(() => {
    if (data?.trove?.status === TroveStatus.Open && !loading) {
      setIsTroveOpenExists(!!data.trove);
    }
  }, [loading, data]);

  return isTroveOpenExists;
};
