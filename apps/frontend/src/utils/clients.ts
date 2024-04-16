import { ApolloClient, InMemoryCache } from '@apollo/client';

import { SUBGRAPH } from '../constants/general';
import { SEPOLIA } from '../constants/infrastructure/sepolia';

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

export const bobClient = new ApolloClient({
  uri: SUBGRAPH.BOB,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const sepoliaSdexClient = new ApolloClient({
  uri: SEPOLIA.subgraph.testnet,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});
