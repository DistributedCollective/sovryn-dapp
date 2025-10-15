import { ApolloClient, InMemoryCache } from '@apollo/client';

import { ChainIds, ChainId } from '@sovryn/ethers-provider';

import { SUBGRAPH } from '../constants/general';
import { ETHEREUM } from '../constants/infrastructure/eth';
import { isRskChain } from './chain';

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
  uri: ETHEREUM.subgraph.testnet,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const bobStakingClient = new ApolloClient({
  uri: SUBGRAPH.BOB_STAKING,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export enum SubgraphType {
  GENERAL,
  STAKING,
}

export const getSubgraphClient = (type: SubgraphType, chainId: ChainId) => {
  if (isRskChain(chainId)) {
    return rskClient;
  }

  if (chainId === ChainIds.SEPOLIA) {
    return sepoliaSdexClient;
  }

  switch (type) {
    case SubgraphType.STAKING:
      return bobStakingClient;
    default:
      return bobClient;
  }
};
