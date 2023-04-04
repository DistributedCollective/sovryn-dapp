import { ApolloClient, InMemoryCache } from '@apollo/client';

import { SUBGRAPH } from '../constants/general';

export const rskClient = new ApolloClient({
  uri: SUBGRAPH.RSK,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const zeroClient = new ApolloClient({
  uri: SUBGRAPH.ZERO,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const myntClient = new ApolloClient({
  uri: SUBGRAPH.MYNT,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});
