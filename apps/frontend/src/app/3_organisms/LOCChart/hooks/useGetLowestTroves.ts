import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';

import { graphZeroUrl } from '../../../../utils/constants';
import { GetLowestTrovesDocument } from '../../../../utils/graphql/zero/generated';

const trovesCount = 100;

const zeroClient = new ApolloClient({
  uri: graphZeroUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const useGetLowestTroves = (userCollateralRatioKey: string) => {
  const { loading, data } = useQuery(GetLowestTrovesDocument, {
    variables: {
      first: trovesCount,
      userCollateralRatioKey: userCollateralRatioKey,
    },
    client: zeroClient,
  });

  return { loading, data };
};
