import { ApolloClient, InMemoryCache } from '@apollo/client';

import { graphMyntUrl, graphRskUrl, graphZeroUrl } from './constants';

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

export const myntClient = new ApolloClient({
  uri: graphMyntUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});
