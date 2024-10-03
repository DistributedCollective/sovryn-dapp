import { ApolloClient, gql, InMemoryCache, useQuery } from '@apollo/client';

import { useState, useEffect, useRef } from 'react';

import { Hex } from 'viem';

import { numberToChainId } from '@sovryn/ethers-provider';
import { ChainId, Token } from '@sovryn/joe-core';
import { PairV2 } from '@sovryn/joe-sdk-v2';

import { BOB } from '../../../../../../constants/infrastructure/bob';
import { Environments } from '../../../../../../types/global';
import { findAssetByAddress } from '../../../../../../utils/asset';
import { PAIR_VERSION } from '../../../LiquidityBookPage.constants';
import { LiquidityBookPool } from '../../../LiquidityBookPage.types';
import { useBlockchainClients } from '../../../utils/client';

export const useGetPools = () => {
  const { publicClient } = useBlockchainClients();
  const [pools, setPools] = useState<LiquidityBookPool[]>([]);
  const [loading, setLoading] = useState(true);

  const client$ = useRef(
    new ApolloClient({
      uri: BOB.joeSubgraph[Environments.Testnet],
      cache: new InMemoryCache(),
    }),
  );

  // ideally, we will use indexer instead of subgraph
  const { loading: queryLoading, data } = useQuery<{
    lbpairs: {
      id: string;
      name: string;
      activeId: string;
      binStep: string;
      reserveX: string;
      reserveY: string;
      tokenX: { id: string; symbol: string; decimals: number };
      tokenY: { id: string; symbol: string; decimals: number };
    }[];
  }>(
    gql`
      query {
        lbpairs {
          id
          name
          activeId
          binStep
          reserveX
          reserveY
          tokenX {
            id
            symbol
            decimals
          }
          tokenY {
            id
            symbol
            decimals
          }
        }
      }
    `,
    {
      client: client$.current,
    },
  );

  // reverseX and reverseY returns strange values, fallback to retrieving it from on-chain
  // const pools = useMemo(
  //   () =>
  //     (data?.lbpairs || []).map(item => ({
  //       pair: [
  //         new Token(
  //           ChainId.BOB_TESTNET,
  //           item.tokenX.id,
  //           item.tokenX.decimals,
  //           item.tokenX.symbol,
  //         ),
  //         new Token(
  //           ChainId.BOB_TESTNET,
  //           item.tokenY.id,
  //           item.tokenY.decimals,
  //           item.tokenY.symbol,
  //         ),
  //       ],
  //       liquidity: [item.reserveX, item.reserveY],
  //       contractAddress: item.id,
  //       activeBinId: parseInt(item.activeId),
  //       binStep: parseInt(item.binStep),
  //     })),
  //   [data],
  // );

  useEffect(() => {
    (async () => {
      const pairs = data?.lbpairs || [];
      if (pairs.length) {
        setLoading(true);
        const reserves = await Promise.allSettled(
          pairs.map(pair =>
            PairV2.getLBPairReservesAndId(
              pair.id as Hex,
              PAIR_VERSION,
              publicClient,
            ),
          ),
        );

        setPools(
          pairs.map((pair, index) => ({
            pair: [
              new Token(
                ChainId.BOB_TESTNET,
                pair.tokenX.id,
                pair.tokenX.decimals,
                findAssetByAddress(
                  pair.tokenX.id,
                  numberToChainId(ChainId.BOB_TESTNET),
                )?.symbol || pair.tokenX.symbol,
              ),
              new Token(
                ChainId.BOB_TESTNET,
                pair.tokenY.id,
                pair.tokenY.decimals,
                findAssetByAddress(
                  pair.tokenY.id,
                  numberToChainId(ChainId.BOB_TESTNET),
                )?.symbol || pair.tokenY.symbol,
              ),
            ],
            liquidity: [
              reserves[index].status === 'fulfilled'
                ? reserves[index].value.reserveX.toString()
                : pair.reserveX,
              reserves[index].status === 'fulfilled'
                ? reserves[index].value.reserveY.toString()
                : pair.reserveY,
            ],
            contractAddress: pair.id,
            activeBinId: parseInt(pair.activeId),
            binStep: parseInt(pair.binStep),
          })),
        );
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { pools, loading: loading || queryLoading };
};
