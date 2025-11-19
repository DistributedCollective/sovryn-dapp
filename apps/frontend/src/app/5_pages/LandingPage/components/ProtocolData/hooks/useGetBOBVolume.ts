import { useMemo } from 'react';

import axios from 'axios';
import { formatUnits } from 'ethers/lib/utils';

import { BOB_CHAIN_ID } from '../../../../../../config/chains';

import { useCacheCall } from '../../../../../../hooks';
import { useChainStore } from '../../../../../../hooks/useChainStore';
import {
  areAddressesEqual,
  getIndexerUrl,
} from '../../../../../../utils/helpers';
import { decimalic } from '../../../../../../utils/math';
import { useGetTokens } from './useGetTokens';

const indexer = getIndexerUrl();

// hard overrides if token list is wrong
const DECIMALS_OVERRIDE: Record<string, number> = {
  // SOV
  '0xba20a5e63eeefffa6fd365e7e540628f8fc61474': 18,
  // WBTC
  '0x0555e30da8f98308edb960aa94c0db47230d2b9c': 8,
  // POWA
  '0xd0c2f08a873186db5cfb7b767db62bef9e495bff': 18,
};

// Treat ultra-small prices as broken (e.g. POWA mispriced at ~1e-7 USD),
// and cap at a generous upper bound for safety.
const isSanePrice = (p: number) => isFinite(p) && p >= 1e-5 && p < 200_000;

export const useGetBOBVolume = () => {
  const { currentChainId } = useChainStore();
  const { value: tokens } = useGetTokens(BOB_CHAIN_ID);

  const { value: volumes } = useCacheCall(
    `sdex/volume`,
    BOB_CHAIN_ID,
    async () => {
      const { data } = await axios.get(indexer + 'sdex/volume', {
        params: { chainId: Number(BOB_CHAIN_ID) },
      });
      return (data?.data || []) as { token: string; volume: string }[];
    },
    [currentChainId],
    [],
  );

  return useMemo(() => {
    if (!tokens.length || !volumes.length) return '0';

    let sum = decimalic(0);

    for (const row of volumes) {
      const token = tokens.find(t => areAddressesEqual(t.address, row.token));
      if (!token) continue;

      const addr = token.address.toLowerCase();
      const decimals = DECIMALS_OVERRIDE[addr] ?? Number(token.decimals ?? 18);
      const price = Number(token.usdPrice);

      // skip insane decimals
      if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36) {
        continue;
      }

      // drop broken feeds like POWA ~ 1e-7, NaN, negative, etc.
      if (!isSanePrice(price)) continue;

      // raw volume is in base units; normalize with decimals
      let units = '0';
      try {
        units = formatUnits(row.volume, decimals);
      } catch {
        continue;
      }

      const usd = decimalic(price).mul(units);

      // drop absurd contributions (protect against a single bad token dominating)
      const usdNum = Number(usd);
      if (!isFinite(usdNum) || usdNum > 1e12) continue;

      sum = sum.add(usd);
    }

    return sum.toString();
  }, [tokens, volumes]);
};
