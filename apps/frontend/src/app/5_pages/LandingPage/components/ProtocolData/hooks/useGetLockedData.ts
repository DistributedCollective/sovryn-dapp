import { useState, useRef, useCallback } from 'react';

import axios, { Canceler } from 'axios';

import { ChainId } from '@sovryn/ethers-provider';

import { BOB_CHAIN_ID } from '../../../../../../config/chains';

import { DATA_REFRESH_INTERVAL } from '../../../../../../constants/general';
import { useChainStore } from '../../../../../../hooks/useChainStore';
import { useInterval } from '../../../../../../hooks/useInterval';
import { decimalic } from '../../../../../../utils/math';
import {
  DEFAULT_LOCKED_DATA,
  LOCKED_DATA_URL,
} from '../ProtocolData.constants';

export const useGetLockedData = (chainId?: ChainId) => {
  const [lockedData, setLockedData] = useState(DEFAULT_LOCKED_DATA);
  const cancelLockedDataRequest = useRef<Canceler>();
  const { currentChainId } = useChainStore();

  const fetchLockedData = useCallback(() => {
    cancelLockedDataRequest.current && cancelLockedDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelLockedDataRequest.current = c;
    });

    axios
      .get(LOCKED_DATA_URL, {
        params: {
          chainId: Number(chainId || currentChainId),
          stmp: Date.now(),
        },
        cancelToken,
      })
      .then(result => {
        const data = result?.data?.data;
        if (!data) return;

        // BOB sanitizer: recompute total from parts; drop insane entries
        if (Number(chainId || currentChainId) === Number(BOB_CHAIN_ID)) {
          // BTC-ish symbols where we validate unit price hard
          const CLAMP_BTC_SYMBOLS = new Set([
            'WBTC',
            'WBTC.OLD',
            'UniBTC',
            'tBTC',
            'XSOLVBTC',
            'SolvBTC',
            'BTC',
            'RBTC',
            'WRBTC',
          ]);

          const MAX_UNIT_PRICE_USD = 200_000; // very generous BTC cap
          const MAX_ASSET_USD = 1e9; // per-asset USD clamp (1B)

          let safeTotal = decimalic(0);

          // Only sum per-asset; ignore bucket totalUsd fields
          const buckets = [
            'tvlSdex',
            'tvlLending',
            'tvlProtocol',
            'tvlStaking',
            'tvlSubprotocols',
            'tvlAmm',
            'tvlZero',
            'tvlMynt',
          ];

          for (const key of buckets) {
            const bucket = (data as any)[key];
            if (!bucket || typeof bucket !== 'object') continue;

            for (const [assetKey, assetVal] of Object.entries(bucket)) {
              // skip bucket-level totals like "totalUsd"
              if (assetKey === 'totalUsd' || assetKey === 'total_usd') continue;

              const v: any = assetVal;
              if (!v || typeof v !== 'object') continue;

              const sym = String(v.assetName || assetKey || '').toUpperCase();
              const balance = Number(v.balance ?? v.amount ?? 0);
              let usd = Number(v.balanceUsd ?? v.totalUsd ?? v.usd ?? 0);

              if (!Number.isFinite(usd) || usd <= 0) continue;
              if (usd > MAX_ASSET_USD) continue;

              // For BTC-like, validate unit price
              if (
                CLAMP_BTC_SYMBOLS.has(sym) &&
                Number.isFinite(balance) &&
                balance > 0
              ) {
                const unit = usd / balance;
                if (!Number.isFinite(unit) || unit > MAX_UNIT_PRICE_USD)
                  continue;
              }

              safeTotal = safeTotal.add(usd);
            }
          }

          // Write the sanitized totals back so the UI necessarily picks them up
          (data as any).total_usd = safeTotal.toString();
          (data as any).totalUsd = (data as any).total_usd;
        }

        setLockedData(data);
      })
      .catch(() => {});
  }, [chainId, currentChainId]);

  useInterval(
    () => {
      fetchLockedData();
    },
    DATA_REFRESH_INTERVAL,
    { immediate: true },
  );

  return lockedData;
};
