import { useState, useEffect, useCallback } from 'react';

import { ChainId } from '@sovryn/joe-core';
import { PairV2 } from '@sovryn/joe-sdk-v2';

import { useBlockNumber } from '../../../../../../hooks/useBlockNumber';
import { PAIR_VERSION } from '../../../LiquidityBookPage.constants';
import { LiquidityBookPool } from '../../../LiquidityBookPage.types';
import { useBlockchainClients } from '../../../utils/client';
import { lbPairUSDT_SOV, lbPairWBTC_USDT } from '../../../utils/pairs';
import { SOV, USDT, WBTC } from '../../../utils/tokens';

export const useGetPools = () => {
  const { value: block } = useBlockNumber();
  const [pools, setPools] = useState<LiquidityBookPool[]>([]);
  const [loading, setLoading] = useState(true);
  const { publicClient } = useBlockchainClients();

  const fetchPoolsData = useCallback(async () => {
    try {
      const [wbtc_usdt, usdt_sov] = await Promise.all([
        lbPairWBTC_USDT.fetchAvailableLBPairs(
          PAIR_VERSION,
          publicClient,
          ChainId.BOB_TESTNET,
        ),
        lbPairUSDT_SOV.fetchAvailableLBPairs(
          PAIR_VERSION,
          publicClient,
          ChainId.BOB_TESTNET,
        ),
      ]);

      const [pair_wbtc_usdt, pair_usdt_sov] = await Promise.all([
        PairV2.getLBPairReservesAndId(
          wbtc_usdt[0].LBPair,
          PAIR_VERSION,
          publicClient,
        ),
        PairV2.getLBPairReservesAndId(
          usdt_sov[0].LBPair,
          PAIR_VERSION,
          publicClient,
        ),
      ]);

      const pools: LiquidityBookPool[] = [
        {
          pair: [WBTC, USDT],
          liquidity: [
            pair_wbtc_usdt.reserveX.toString(),
            pair_wbtc_usdt.reserveY.toString(),
          ],
          contractAddress: wbtc_usdt[0].LBPair,
          activeBinId: pair_wbtc_usdt.activeId,
          binStep: wbtc_usdt[0].binStep,
        },
        {
          pair: [USDT, SOV],
          liquidity: [
            pair_usdt_sov.reserveX.toString(),
            pair_usdt_sov.reserveY.toString(),
          ],
          contractAddress: usdt_sov[0].LBPair,
          activeBinId: pair_usdt_sov.activeId,
          binStep: usdt_sov[0].binStep,
        },
      ];

      setPools(prevPools => {
        const newPoolsJson = JSON.stringify(pools);
        const prevPoolsJson = JSON.stringify(prevPools);
        return newPoolsJson === prevPoolsJson ? prevPools : pools;
      });
    } catch (err) {
      console.error('Error fetching pool data:', err);
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    if (publicClient) {
      fetchPoolsData();
    }
  }, [fetchPoolsData, publicClient, block]);

  return { pools, loading };
};
