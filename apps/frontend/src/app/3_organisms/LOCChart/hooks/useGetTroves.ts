import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { useIsMobile } from '../../../../hooks/useIsMobile';
import { graphZeroUrl } from '../../../../utils/constants';
import { GetTrovesDocument } from '../../../../utils/graphql/zero/generated';

const trovesCount = 20;
const trovesCountMobile = 7;

const zeroClient = new ApolloClient({
  uri: graphZeroUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const useGetTroves = () => {
  const { isMobile } = useIsMobile();
  const trovesCountToFetch = useMemo(
    () => (!isMobile ? trovesCount : trovesCountMobile),
    [isMobile],
  );
  const { loading, data } = useQuery(GetTrovesDocument, {
    variables: {
      first: trovesCountToFetch,
    },
    client: zeroClient,
  });

  return { loading, data };
};
