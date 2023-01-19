import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';

import { useEffect, useMemo, useState } from 'react';

import { useWalletConnect } from '../../../../hooks/useWalletConnect';
import { graphZeroUrl } from '../../../../utils/constants';
import { GetUserOpenTroveDocument } from '../../../../utils/graphql/zero/generated';

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

  const { loading, data } = useQuery(GetUserOpenTroveDocument, {
    variables: troveConfig,
    client: zeroClient,
  });

  useEffect(() => {
    if (data && data.trove && !loading) {
      setIsTroveOpenExists(!!data.trove);
    }
  }, [loading, data]);

  return isTroveOpenExists;
};
