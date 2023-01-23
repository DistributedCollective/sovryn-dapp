import { ApolloClient, InMemoryCache } from '@apollo/client';

import { graphRskUrl, graphZeroUrl } from './constants';

export const rskClient = new ApolloClient({
  uri: graphRskUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const zeroClient = new ApolloClient({
  uri: graphZeroUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});
