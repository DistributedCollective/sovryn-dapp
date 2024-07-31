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
console.log(indexer + 'sdex/volume');

export const useGetBOBVolume = () => {
  const { currentChainId } = useChainStore();
  const { value: tokens } = useGetTokens(BOB_CHAIN_ID);
  const { value: volumes } = useCacheCall(
    `sdex/volume`,
    BOB_CHAIN_ID,
    async () => {
      const { data } = await axios.get(indexer + 'sdex/volume', {
        params: {
          chainId: Number(BOB_CHAIN_ID),
        },
      });

      return (data?.data || []) as { token: string; volume: string }[];
    },
    [currentChainId],
    [],
  );

  return useMemo(() => {
    if (!tokens.length || !volumes.length) {
      return '0';
    }

    let sum = decimalic(0);

    volumes.forEach(volumeData => {
      const token = tokens.find(t =>
        areAddressesEqual(t.address, volumeData.token),
      );

      if (token) {
        const volume = decimalic(volumeData.volume).toString();
        sum = sum.add(
          decimalic(token.usdPrice).mul(formatUnits(volume, token.decimals)),
        );
      }
    });

    return sum.toString();
  }, [tokens, volumes]);
};
